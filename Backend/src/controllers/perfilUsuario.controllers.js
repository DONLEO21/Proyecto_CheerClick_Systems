import { dbCreatePerfilUsuario, dbGetPerfilUsuario, dbUpdatePerfilUsuario, dbGetPerfilByUsuario } from "../services/perfilUsuario.services.js";
import { dbGetContactosByUsuario, dbCreateContactoE, dbUpdateContactoE } from "../services/contactoEmergencia.services.js";
import { dbGetUsuarioConPlan, dbFindUserByEmail, dbUpdateUsuario } from "../services/usuarios.services.js";
import { sendCorreoCambiadoEmail } from "../services/email.services.js";
import { guardarFoto, borrarFoto, guardarCertificado, borrarCertificado, rutaCertificado } from "../services/archivos.services.js";

const responderError = (res, error, msg) => {
    console.error(error);

    if (error.code === 11000) {
        return res.status(409).json({ errors: { numDocumento: 'Este número de documento ya está registrado' } });
    }

    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) errors[field] = error.errors[field].message;
        return res.status(400).json({ errors });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({ msg: 'El ID no tiene un formato válido' });
    }

    res.status(500).json({ msg });
}

const esAdmin = (req) => req.userFound.rol === 'Administrador';

// Solo el dueño del perfil o un administrador
const esDuenoOAdmin = (req, perfil) => {
    if (esAdmin(req)) return true;
    const duenoId = perfil.perteneceA?._id ?? perfil.perteneceA;
    return String(duenoId) === String(req.userFound._id);
}

// El certificado es privado: nunca se expone su nombre de archivo, solo si existe
const perfilPublico = (perfil) => {
    if (!perfil) return null;
    const obj = perfil.toObject();
    obj.tieneCertificadoEps = !!obj.certificadoEps;
    delete obj.certificadoEps;
    return obj;
}

// Carga el perfil y valida existencia, estado y permisos.
// Si algo falla ya responde y devuelve null.
const cargarPerfil = async (req, res) => {
    const perfil = await dbGetPerfilUsuario(req.params.id);

    // Un perfil inhabilitado solo lo ve el admin
    if (!perfil || (!perfil.status && !esAdmin(req))) {
        res.status(404).json({ msg: 'Perfil no encontrado' });
        return null;
    }
    if (!esDuenoOAdmin(req, perfil)) {
        res.status(403).json({ msg: 'No tienes permiso sobre este perfil' });
        return null;
    }
    return perfil;
}

// "Otro": limpia el texto libre si ya no aplica y exige el texto si se eligió "Otro"
const validarOtros = (data) => {
    if (data.genero && data.genero !== 'Otro') data.generoOtro = null;
    if (data.eps && data.eps !== 'Otra') data.epsOtra = null;

    if (data.genero === 'Otro' && !data.generoOtro?.trim()) {
        return { generoOtro: 'Escribe tu género' };
    }
    if (data.eps === 'Otra' && !data.epsOtra?.trim()) {
        return { epsOtra: 'Escribe el nombre de tu EPS' };
    }
    return null;
}

// Campos que solo cambian por su propio endpoint
const quitarCamposProtegidos = (data) => {
    delete data.perteneceA;
    delete data.status;
    delete data.fotoPerfil;
    delete data.certificadoEps;
    delete data.ediciones;
}

const createPerfilUsuario = async (req, res) => {
    try {
        const inputData = req.body;

        quitarCamposProtegidos(inputData);

        // El perfil siempre pertenece a quien lo registra y nace activo
        inputData.perteneceA = req.userFound._id;

        const errors = validarOtros(inputData);
        if (errors) return res.status(400).json({ errors });

        // Un usuario solo puede tener un perfil
        const existente = await dbGetPerfilByUsuario(req.userFound._id);
        if (existente) {
            return res.status(409).json({ msg: 'Este usuario ya tiene un perfil registrado' });
        }

        const data = await dbCreatePerfilUsuario(inputData);

        res.status(201).json({ msg: 'Registra perfil de usuario', data: perfilPublico(data) });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido registrar el perfil de usuario');
    }
}

const getPerfilUsuario = async (req, res) => {
    try {
        const perfil = await cargarPerfil(req, res);
        if (!perfil) return;

        res.json({ msg: 'Obtiene un perfil de usuario', data: perfilPublico(perfil) });
    }
    catch (error) {
        responderError(res, error, 'No se puede obtener el perfil de usuario por ID');
    }
}

// Edición por el administrador 
const updatePerfilUsuario = async (req, res) => {
    try {
        const perfil = await cargarPerfil(req, res);
        if (!perfil) return;

        const inputData = req.body;
        quitarCamposProtegidos(inputData);

        const errors = validarOtros(inputData);
        if (errors) return res.status(400).json({ errors });

        const data = await dbUpdatePerfilUsuario(req.params.id, inputData);

        res.json({ msg: 'Perfil de usuario actualizado', data: perfilPublico(data) });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido actualizar el perfil de usuario por ID');
    }
}

// Inactiva o activa un perfil de usuario
const cambiarEstadoPerfilUsuario = async (req, res) => {
    try {
        const { status } = req.body;

        if (typeof status !== 'boolean') {
            return res.status(400).json({ errors: { status: 'Debe ser true o false' } });
        }

        const perfil = await cargarPerfil(req, res);
        if (!perfil) return;

        if (status === true && !esAdmin(req)) {
            return res.status(403).json({ msg: 'Solo un administrador puede reactivar un perfil' });
        }

        const data = await dbUpdatePerfilUsuario(req.params.id, { status });

        res.json({
            msg: status ? 'Perfil reactivado' : 'Perfil inhabilitado',
            data: perfilPublico(data)
        });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido cambiar el estado del perfil');
    }
}

// ---------- Mi perfil ----------

// Campos que el usuario solo puede corregir una vez
const CAMPOS_UNA_VEZ = ['numDocumento', 'genero', 'fechaNacimiento'];


const getMiPerfil = async (req, res) => {
    try {
        const id = req.userFound._id;

        const [usuario, perfil, contactos] = await Promise.all([
            dbGetUsuarioConPlan(id),
            dbGetPerfilByUsuario(id),
            dbGetContactosByUsuario(id)
        ]);

        const perfilObj = perfilPublico(perfil);
        if (perfilObj) perfilObj.certificadoEpsUrl = perfilObj.tieneCertificadoEps ? '/api/perfilusuario/me/certificado-eps' : null;
        let camposBloqueados = [];

        if (perfilObj && !esAdmin(req)) {
            camposBloqueados = CAMPOS_UNA_VEZ.filter(c => (perfilObj.ediciones?.[c] ?? 0) >= 1);
        }

        res.json({
            msg: 'Mi perfil',
            data: {
                nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
                usuario,                 
                perfil: perfilObj,       
                camposBloqueados,       
                contactos
            }
        });
    }
    catch (error) {
        responderError(res, error, 'No se pudo obtener tu perfil');
    }
}

const CAMPOS_PERFIL = ['tipoDocumento', 'numDocumento', 'genero', 'generoOtro', 'telefono', 'fechaNacimiento', 'eps', 'epsOtra', 'poliza'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mismaFecha = (a, b) => new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);

const updateMiPerfil = async (req, res) => {
    try {
        const body = req.body;
        const user = req.userFound;
        const admin = esAdmin(req);

        // ----- Paso 1: datos del usuario
        const datosUsuario = {};

        for (const campo of ['nombre', 'apellido']) {
            if (body[campo] !== undefined) {
                if (!String(body[campo]).trim()) {
                    return res.status(400).json({ errors: { [campo]: `El ${campo} es obligatorio` } });
                }
                datosUsuario[campo] = String(body[campo]).trim();
            }
        }

        let correoAnterior = null;
        if (body.email !== undefined) {
            const email = String(body.email).trim().toLowerCase();

            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({ errors: { email: 'El correo no es válido' } });
            }
            if (email !== user.email) {
                if (await dbFindUserByEmail(email)) {
                    return res.status(409).json({ errors: { email: 'Este correo ya está registrado' } });
                }
                datosUsuario.email = email;
                correoAnterior = user.email;
            }
        }

        // ----- Paso 2: datos del perfil -----
        if (CAMPOS_PERFIL.some(c => body[c] !== undefined)) {
            const perfil = await dbGetPerfilByUsuario(user._id);
            if (!perfil) {
                return res.status(404).json({ msg: 'Primero debes crear tu perfil' });
            }

            const datosPerfil = {};
            const incrementos = {};

            for (const campo of CAMPOS_PERFIL) {
                if (body[campo] !== undefined) datosPerfil[campo] = body[campo];
            }

            if (datosPerfil.fechaNacimiento !== undefined && isNaN(new Date(datosPerfil.fechaNacimiento))) {
                return res.status(400).json({ errors: { fechaNacimiento: 'La fecha no es válida' } });
            }

            // Campos de una sola vez
            if (!admin) {
                const bloqueados = [];

                const cambios = {
                    numDocumento: datosPerfil.numDocumento !== undefined
                        && String(datosPerfil.numDocumento).trim() !== perfil.numDocumento,
                    genero: (datosPerfil.genero !== undefined && datosPerfil.genero !== perfil.genero)
                        || (datosPerfil.generoOtro !== undefined && (datosPerfil.generoOtro ?? null) !== perfil.generoOtro),
                    fechaNacimiento: datosPerfil.fechaNacimiento !== undefined
                        && !mismaFecha(datosPerfil.fechaNacimiento, perfil.fechaNacimiento)
                };

                for (const campo of Object.keys(cambios)) {
                    if (!cambios[campo]) continue;
                    if ((perfil.ediciones?.[campo] ?? 0) >= 1) bloqueados.push(campo);
                    else incrementos[`ediciones.${campo}`] = 1;
                }

                if (bloqueados.length > 0) {
                    return res.status(403).json({
                        msg: 'Estos campos ya no los puedes modificar. Contacta al club',
                        camposBloqueados: bloqueados
                    });
                }
            }

            // "Otro": se valida contra lo que quedará guardado
            const fusion = {
                genero: perfil.genero, generoOtro: perfil.generoOtro,
                eps: perfil.eps, epsOtra: perfil.epsOtra,
                ...datosPerfil
            };
            const errors = validarOtros(fusion);
            if (errors) return res.status(400).json({ errors });

            datosPerfil.generoOtro = fusion.generoOtro;
            datosPerfil.epsOtra = fusion.epsOtra;

            // ----- Paso 3: guardar el perfil -----
            const update = { $set: datosPerfil };
            if (Object.keys(incrementos).length > 0) update.$inc = incrementos;

            await dbUpdatePerfilUsuario(perfil._id, update);
        }

        // ----- Paso 4: guardar el usuario -----
        if (Object.keys(datosUsuario).length > 0) {
            await dbUpdateUsuario(user._id, datosUsuario);
        }

        // ----- Paso 5: avisar al correo anterior ----
        let correoAvisado = null;
        if (correoAnterior) {
            try {
                await sendCorreoCambiadoEmail(correoAnterior, user.nombre, datosUsuario.email);
                correoAvisado = true;
            } catch (error) {
                console.error(error);
                correoAvisado = false;
            }
        }

        res.json({ msg: 'Perfil actualizado', correoAvisado });

    } catch (error) {
        responderError(res, error, 'No se pudo actualizar tu perfil');
    }
}

// Actualiza la foto de perfil del usuario. Borra la anterior si existía.
const updateMiFoto = async (req, res) => {
    try {
        const perfil = await dbGetPerfilByUsuario(req.userFound._id);
        if (!perfil) return res.status(404).json({ msg: 'Primero debes crear tu perfil' });

        const ruta = await guardarFoto(req.file);
        await dbUpdatePerfilUsuario(perfil._id, { fotoPerfil: ruta });
        await borrarFoto(perfil.fotoPerfil);

        res.json({ msg: 'Foto de perfil actualizada', fotoPerfil: ruta });
    }
    catch (error) {
        if (error.status === 400) return res.status(400).json({ msg: error.message });
        responderError(res, error, 'No se pudo guardar la foto');
    }
}

// PUT /api/perfilusuario/me/certificado-eps  (se puede volver a subir: reemplaza el anterior)
const updateMiCertificado = async (req, res) => {
    try {
        const perfil = await dbGetPerfilByUsuario(req.userFound._id);
        if (!perfil) return res.status(404).json({ msg: 'Primero debes crear tu perfil' });

        const nombre = await guardarCertificado(req.file);
        await dbUpdatePerfilUsuario(perfil._id, { certificadoEps: nombre });
        await borrarCertificado(perfil.certificadoEps);

        res.json({ msg: 'Certificado de EPS actualizado', tieneCertificadoEps: true });
    }
    catch (error) {
        if (error.status === 400) return res.status(400).json({ msg: error.message });
        responderError(res, error, 'No se pudo guardar el certificado');
    }
}

// GET /api/perfilusuario/me/certificado-eps  descargar certificado del usuario
const descargarMiCertificado = async (req, res) => {
    try {
        const perfil = await dbGetPerfilByUsuario(req.userFound._id);

        if (!perfil?.certificadoEps) {
            return res.status(404).json({ msg: 'Aún no has subido tu certificado de EPS' });
        }

        res.sendFile(rutaCertificado(perfil.certificadoEps), error => {
            if (error && !res.headersSent) {
                res.status(404).json({ msg: 'No se encontró el archivo del certificado' });
            }
        });
    }
    catch (error) {
        responderError(res, error, 'No se pudo obtener el certificado');
    }
}

const PARENTESCOS = ['Madre', 'Padre', 'Tutor', 'Cónyuge', 'Otro'];

// Valida un contacto
const validarContacto = ( c ) => {
    const errors = {};
    if( ! String( c.nombre ?? '' ).trim() ) errors.nombre = 'El nombre es obligatorio';
    if( ! String( c.apellido ?? '' ).trim() ) errors.apellido = 'El apellido es obligatorio';
    if( ! String( c.telefono ?? '' ).trim() ) errors.telefono = 'El teléfono es obligatorio';
    if( c.parentesco && ! PARENTESCOS.includes( c.parentesco ) ) errors.parentesco = 'Parentesco no válido';
    if( c.parentesco === 'Otro' && ! String( c.parentescoOtro ?? '' ).trim() ) errors.parentescoOtro = 'Escribe el parentesco';
    return Object.keys( errors ).length > 0 ? errors : null;
}

// PUT /api/perfilusuario/me/contactos   actualizar contactos de emergencia del usuario
const updateMisContactos = async (req, res) => {
    try {
        const lista = req.body.contactos;
        const user = req.userFound;
        const requeridos = user.rol === 'Atleta' ? 2 : 1;

        if( ! Array.isArray( lista ) || lista.length !== requeridos ) {
            return res.status(400).json({
                msg: user.rol === 'Atleta'
                    ? 'Un atleta debe tener exactamente 2 contactos de emergencia'
                    : 'Debes registrar exactamente 1 contacto de emergencia'
            });
        }

        // Un solo principal; si solo hay uno, es el principal
        if( requeridos === 1 ) {
            lista[0].principal = true;
        } else if( lista.filter( c => c.principal === true ).length !== 1 ) {
            return res.status(400).json({ msg: 'Exactamente uno de los 2 contactos debe ser el principal' });
        }

        // Validar todos antes de guardar nada
        const errores = lista.map( validarContacto );
        if( errores.some( e => e ) ) {
            return res.status(400).json({ errors: errores });
        }

        // Los _id enviados son contactos activos del propio usuario
        const actuales = await dbGetContactosByUsuario( user._id );
        const idsPropios = actuales.map( c => String( c._id ) );
        const idsEnviados = lista.filter( c => c._id ).map( c => String( c._id ) );

        if( idsEnviados.some( id => ! idsPropios.includes( id ) ) ) {
            return res.status(403).json({ msg: 'Uno de los contactos no te pertenece' });
        }
        if( new Set( idsEnviados ).size !== idsEnviados.length ) {
            return res.status(400).json({ msg: 'Hay contactos repetidos en la lista' });
        }

        // Guardar: actualizar o crear
        for( const c of lista ) {
            const datos = {
                nombre: c.nombre.trim(),
                apellido: c.apellido.trim(),
                telefono: c.telefono.trim(),
                parentesco: c.parentesco || 'Madre',
                parentescoOtro: c.parentesco === 'Otro' ? c.parentescoOtro.trim() : null,
                principal: c.principal === true
            };

            if( c._id ) await dbUpdateContactoE( c._id, datos );
            else await dbCreateContactoE({ ...datos, createdBy: user._id });
        }

        // Inhabilitar los que ya no están en la lista
        for( const id of idsPropios.filter( id => ! idsEnviados.includes( id ) ) ) {
            await dbUpdateContactoE( id, { status: false } );
        }

        const contactos = await dbGetContactosByUsuario( user._id );
        res.json({ msg: 'Contactos de emergencia actualizados', contactos });
    }
    catch (error) {
        responderError(res, error, 'No se pudieron guardar los contactos');
    }
}

// PATCH /api/perfilusuario/me/preferencias   body: { notificaciones?: boolean, correos?: boolean }
const updateMisPreferencias = async (req, res) => {
    try {
        const { notificaciones, correos } = req.body;
        const cambios = {};

        if (notificaciones !== undefined) {
            if (typeof notificaciones !== 'boolean') {
                return res.status(400).json({ errors: { notificaciones: 'Debe ser true o false' } });
            }
            cambios['preferencias.notificaciones'] = notificaciones;
        }

        if (correos !== undefined) {
            if (typeof correos !== 'boolean') {
                return res.status(400).json({ errors: { correos: 'Debe ser true o false' } });
            }
            cambios['preferencias.correos'] = correos;
        }

        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ msg: 'Envía notificaciones, correos o ambos' });
        }

        const data = await dbUpdateUsuario(req.userFound._id, { $set: cambios });

        res.json({ msg: 'Preferencias actualizadas', preferencias: data.preferencias });
    }
    catch (error) {
        responderError(res, error, 'No se pudieron guardar las preferencias');
    }
}

export {
    createPerfilUsuario,
    getPerfilUsuario,
    updatePerfilUsuario,
    cambiarEstadoPerfilUsuario,
    getMiPerfil,
    updateMiPerfil,
    updateMiFoto,
    updateMiCertificado,
    descargarMiCertificado,
    updateMisContactos,
    updateMisPreferencias
}
