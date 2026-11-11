import {
    dbListUsuarios, dbCountUsuarios, dbGetUsuario, dbGetUsuarioConPlan, dbUpdateUsuario, dbGenerarCodigo, PREFIJOS
} from "../services/usuarios.services.js";
import { dbGetPerfilByUsuario } from "../services/perfilUsuario.services.js";
import { dbGetContactosByUsuario } from "../services/contactoEmergencia.services.js";
import { sendSolicitudEmail } from "../services/email.services.js";
import { rutaCertificado } from "../services/archivos.services.js";

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

        const usuario = await dbGetUsuarioConPlan( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const perfil = await dbGetPerfilByUsuario( id );
        const contactos = await dbGetContactosByUsuario( id );

        let perfilObj = null;
        if( perfil ) {
            perfilObj = perfil.toObject();

            // El archivo es privado: se informa si existe y por dónde descargarlo (con token)
            perfilObj.tieneCertificadoEps = !!perfilObj.certificadoEps;
            perfilObj.certificadoEpsUrl = perfilObj.certificadoEps ? `/api/usuarios/${id}/certificado-eps` : null;

            delete perfilObj.certificadoEps;   
            delete perfilObj.fotoPerfil;     
        }

        res.json({ msg: 'Detalle del usuario', data: { usuario, perfil: perfilObj, contactos } });

    } catch (error) {
        responderError( res, error, 'No se pudo obtener el detalle del usuario' );
    }
}

// GET /api/usuarios/:id/certificado-eps visualizar certificado solo admin
const descargarCertificadoEps = async ( req, res ) => {
    try {
        const perfil = await dbGetPerfilByUsuario( req.params.id );

        if( ! perfil?.certificadoEps ) {
            return res.status(404).json({ msg: 'Este usuario no tiene certificado de EPS' });
        }

        res.sendFile( rutaCertificado( perfil.certificadoEps ), error => {
            if( error && ! res.headersSent ) {
                res.status(404).json({ msg: 'No se encontró el archivo del certificado' });
            }
        });

    } catch (error) {
        responderError( res, error, 'No se pudo obtener el certificado' );
    }
}

// PATCH /api/usuarios/solicitudes/:id/aprobar  aprobar una solicitud de cuenta
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

// PATCH /api/usuarios/solicitudes/:id/rechazar rechazar una solicitud de cuenta 
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

// ---------- Gestión de cuentas ----------

// GET /api/usuarios?buscar=stuard&page=1  filtrar por nombre, apellido o correo
const listCuentas = async ( req, res ) => {
    try {
        const { buscar, page } = req.query;

        const filtro = { estadoSolicitud: 'Aprobada', ...filtroBusqueda( buscar ) };
        const { data, total } = await dbListUsuarios( filtro, Math.max( Number( page ) || 1, 1 ) );

        // Contadores: "7 Usuarios totales / activos / inactivos"
        const base = { estadoSolicitud: 'Aprobada' };
        const [ totales, activos, inactivos ] = await Promise.all([
            dbCountUsuarios( base ),
            dbCountUsuarios({ ...base, status: true }),
            dbCountUsuarios({ ...base, status: false })
        ]);

        res.json({ msg: 'Cuentas', data, total, conteos: { totales, activos, inactivos } });

    } catch (error) {
        responderError( res, error, 'No se pudieron obtener las cuentas' );
    }
}

// PATCH /api/usuarios/:id/status   cambiar estado activo o inactivo (solo admin)
const cambiarStatus = async ( req, res ) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if( typeof status !== 'boolean' ) {
            return res.status(400).json({ msg: 'El status debe ser true o false' });
        }

        // El administrador no puede desactivarse a sí mismo
        if( String( req.userFound._id ) === id ) {
            return res.status(400).json({ msg: 'No puedes desactivar tu propia cuenta' });
        }

        const usuario = await dbGetUsuario( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if( usuario.estadoSolicitud !== 'Aprobada' ) {
            return res.status(409).json({ msg: 'Solo se pueden activar o desactivar cuentas aprobadas' });
        }

        const data = await dbUpdateUsuario( id, { status: status } );

        res.json({ msg: status ? 'Cuenta activada' : 'Cuenta desactivada', data: sinContrasena( data ) });

    } catch (error) {
        responderError( res, error, 'No se pudo cambiar el estado de la cuenta' );
    }
}

// PATCH /api/usuarios/:id/rol   cambiar rol solo admin
const cambiarRol = async ( req, res ) => {
    try {
        const id = req.params.id;
        const { rol } = req.body;

        if( ! PREFIJOS[rol] ) {
            return res.status(400).json({ msg: 'El rol debe ser Atleta, Entrenador o Administrador' });
        }

        // El administrador no puede quitarse su propio rol
        if( String( req.userFound._id ) === id ) {
            return res.status(400).json({ msg: 'No puedes cambiar tu propio rol' });
        }

        const usuario = await dbGetUsuario( id );
        if( ! usuario ) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if( usuario.estadoSolicitud !== 'Aprobada' ) {
            return res.status(409).json({ msg: 'Solo se puede cambiar el rol de cuentas aprobadas' });
        }

        if( usuario.rol === rol ) {
            return res.json({ msg: 'El usuario ya tiene ese rol', data: sinContrasena( usuario ) });
        }

        // El código cambia con el rol: pasa de AT003 a EN001, por ejemplo
        const data = await dbUpdateUsuario( id, { rol: rol, codigo: await dbGenerarCodigo( rol ) } );

        res.json({ msg: 'Rol actualizado', data: sinContrasena( data ) });

    } catch (error) {
        responderError( res, error, 'No se pudo cambiar el rol' );
    }
}

export {
    listSolicitudes,
    getDetalleUsuario,
    descargarCertificadoEps,
    aprobarSolicitud,
    rechazarSolicitud,
    listCuentas,
    cambiarStatus,
    cambiarRol
}