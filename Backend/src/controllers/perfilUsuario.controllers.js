import {
    dbCreatePerfilUsuario,
    dbGetPerfilUsuario,
    dbUpdatePerfilUsuario,
    dbGetPerfilByUsuario
} from "../services/perfilUsuario.services.js";
import { dbGetUsuarioConPlan } from "../services/usuarios.services.js";
import { dbGetContactosByUsuario } from "../services/contactoEmergencia.services.js";
import { dbFindUserByEmail, dbUpdateUsuario } from "../services/usuarios.services.js";
import { sendCorreoCambiadoEmail } from "../services/email.services.js";

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

const createPerfilUsuario = async (req, res) => {
    try {
        const inputData = req.body;

        // El perfil siempre pertenece a quien lo registra y nace activo
        inputData.perteneceA = req.userFound._id;
        delete inputData.status;
        delete inputData.fotoPerfil;
        delete inputData.certificadoEps;
        delete inputData.ediciones;

        const errors = validarOtros(inputData, true);
        if (errors) return res.status(400).json({ errors });

        // Un usuario solo puede tener un perfil
        const existente = await dbGetPerfilByUsuario(req.userFound._id);
        if (existente) {
            return res.status(409).json({ msg: 'Este usuario ya tiene un perfil registrado' });
        }

        const data = await dbCreatePerfilUsuario(inputData);

        res.status(201).json({ msg: 'Registra perfil de usuario', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido registrar el perfil de usuario');
    }
}

const getPerfilUsuario = async (req, res) => {
    try {
        const perfil = await cargarPerfil(req, res);
        if (!perfil) return;

        res.json({ msg: 'Obtiene un perfil de usuario', data: perfil });
    }
    catch (error) {
        responderError(res, error, 'No se puede obtener el perfil de usuario por ID');
    }
}

const updatePerfilUsuario = async (req, res) => {
    try {
        const perfil = await cargarPerfil(req, res);
        if (!perfil) return;

        const inputData = req.body;

        delete inputData.perteneceA;
        delete inputData.fotoPerfil;
        delete inputData.certificadoEps;
        delete inputData.ediciones;
        delete inputData.status;

        const errors = validarOtros(inputData, false);
        if (errors) return res.status(400).json({ errors });

        const data = await dbUpdatePerfilUsuario(req.params.id, inputData);

        res.json({ msg: 'Perfil de usuario actualizado', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido actualizar el perfil de usuario por ID');
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

        // ----- Paso 1: datos del usuario (nombre, apellido, correo) -----
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
        const datosPerfil = {};
        const incrementos = {};

        if (CAMPOS_PERFIL.some(c => body[c] !== undefined)) {
            const perfil = await dbGetPerfilByUsuario(user._id);
            if (!perfil) {
                return res.status(404).json({ msg: 'Primero debes crear tu perfil' });
            }

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

            // "Otro" y se valida contra lo que quedará guardado
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

        // ----- Paso 5: avisar al correo anterior (si falla, el cambio igual queda) -----
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
            data: data
        });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido cambiar el estado del perfil');
    }
}

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

        // El certificado es privado, no se envia al frontend
        let perfilObj = null;
        let camposBloqueados = [];

        if (perfil) {
            perfilObj = perfil.toObject();
            perfilObj.tieneCertificadoEps = !!perfilObj.certificadoEps;
            delete perfilObj.certificadoEps;

            if (!esAdmin(req)) {
                camposBloqueados = CAMPOS_UNA_VEZ.filter(c => (perfilObj.ediciones?.[c] ?? 0) >= 1);
            }
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

export {
    createPerfilUsuario,
    getPerfilUsuario,
    updatePerfilUsuario,
    getMiPerfil,
    cambiarEstadoPerfilUsuario,
    updateMiPerfil
}