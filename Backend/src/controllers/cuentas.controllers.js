import {
    dbListUsuarios, dbCountUsuarios, dbGetUsuario, dbUpdateUsuario, dbGenerarCodigo, PREFIJOS
} from "../services/usuarios.services.js";
import { dbGetPerfilByUsuario } from "../services/perfilUsuario.services.js";
import { dbGetContactosByUsuario } from "../services/contactoEmergencia.services.js";
import { sendSolicitudEmail } from "../services/email.services.js";

const ESTADOS = ['Pendiente', 'Aprobada', 'Rechazada'];

// ---------- Utilidades ----------

// Escapa caracteres especiales para que lo escrito en la barra de búsqueda no se tome como expresión regular
const escapar = ( texto ) => texto.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );

// Búsqueda por nombre, apellido o correo. "sofia perez" busca cada palabra por separado
const filtroBusqueda = ( buscar ) => {
    const palabras = String( buscar ?? '' ).trim().split( /\s+/ ).filter( Boolean );

    if( palabras.length === 0 ) return {};

    return {
        $and: palabras.map( palabra => {
            const regex = new RegExp( escapar( palabra ), 'i' );
            return { $or: [ { nombre: regex }, { apellido: regex }, { email: regex } ] };
        })
    };
}

const sinContrasena = ( usuario ) => {
    const obj = usuario.toObject();
    delete obj.contrasena;
    return obj;
}

const responderError = ( res, error, msg ) => {
    console.error( error );

    if( error.name === 'CastError' ) {
        return res.status(400).json({ msg: 'El ID no tiene un formato válido' });
    }
    res.status(500).json({ msg });
}

// ---------- Solicitudes de cuentas nuevas ----------

// GET /api/usuarios/solicitudes?estado=Pendiente&buscar=sofia&page=1
const listSolicitudes = async ( req, res ) => {
    try {
        const { estado = 'Pendiente', buscar, page } = req.query;

        if( ! ESTADOS.includes( estado ) ) {
            return res.status(400).json({ msg: 'El estado debe ser Pendiente, Aprobada o Rechazada' });
        }

        const filtro = { estadoSolicitud: estado, ...filtroBusqueda( buscar ) };
        const { data, total } = await dbListUsuarios( filtro, Math.max( Number( page ) || 1, 1 ) );

        // Contadores de las pestañas ("2 solicitudes pendientes")
        const [ pendientes, aprobadas, rechazadas ] = await Promise.all(
            ESTADOS.map( e => dbCountUsuarios({ estadoSolicitud: e }) )
        );

        res.json({ msg: 'Solicitudes', data, total, conteos: { pendientes, aprobadas, rechazadas } });

    } catch (error) {
        responderError( res, error, 'No se pudieron obtener las solicitudes' );
    }
}

// GET /api/usuarios/:id/detalle  (el "ojito": registro + perfil + contactos de emergencia)
const getDetalleUsuario = async ( req, res ) => {
    try {
        const id = req.params.id;

        const usuario = await dbGetUsuario( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const perfil = await dbGetPerfilByUsuario( id );
        const contactos = await dbGetContactosByUsuario( id );

        res.json({ msg: 'Detalle del usuario', data: { usuario, perfil, contactos } });

    } catch (error) {
        responderError( res, error, 'No se pudo obtener el detalle del usuario' );
    }
}

// PATCH /api/usuarios/solicitudes/:id/aprobar   body: { rol }
const aprobarSolicitud = async ( req, res ) => {
    try {
        const id = req.params.id;
        const { rol } = req.body;

        // El administrador decide el rol en el modal
        if( ! PREFIJOS[rol] ) {
            return res.status(400).json({ msg: 'Debes elegir un rol: Atleta, Entrenador o Administrador' });
        }

        const usuario = await dbGetUsuario( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if( usuario.estadoSolicitud !== 'Pendiente' ) {
            return res.status(409).json({ msg: 'Esta solicitud ya fue procesada' });
        }

        const data = await dbUpdateUsuario( id, {
            estadoSolicitud: 'Aprobada',
            rol: rol,
            codigo: await dbGenerarCodigo( rol )
        });

        // Si el correo falla, la aprobación igual queda guardada
        let correoEnviado = true;
        try {
            await sendSolicitudEmail( data.email, data.nombre, true, rol );
        } catch (error) {
            console.error( error );
            correoEnviado = false;
        }

        res.json({ msg: 'Solicitud aprobada', correoEnviado, data: sinContrasena( data ) });

    } catch (error) {
        responderError( res, error, 'No se pudo aprobar la solicitud' );
    }
}

// PATCH /api/usuarios/solicitudes/:id/rechazar
const rechazarSolicitud = async ( req, res ) => {
    try {
        const id = req.params.id;

        const usuario = await dbGetUsuario( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if( usuario.estadoSolicitud !== 'Pendiente' ) {
            return res.status(409).json({ msg: 'Esta solicitud ya fue procesada' });
        }

        const data = await dbUpdateUsuario( id, { estadoSolicitud: 'Rechazada' } );

        let correoEnviado = true;
        try {
            await sendSolicitudEmail( data.email, data.nombre, false );
        } catch (error) {
            console.error( error );
            correoEnviado = false;
        }

        res.json({ msg: 'Solicitud rechazada', correoEnviado, data: sinContrasena( data ) });

    } catch (error) {
        responderError( res, error, 'No se pudo rechazar la solicitud' );
    }
}

export {
    listSolicitudes,
    getDetalleUsuario,
    aprobarSolicitud,
    rechazarSolicitud
}