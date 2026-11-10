import {
    dbCreatePerfilUsuario,
    dbGetPerfilUsuario,
    dbUpdatePerfilUsuario,
    dbGetPerfilByUsuario
} from "../services/perfilUsuario.services.js";

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

export {
    createPerfilUsuario,
    getPerfilUsuario,
    updatePerfilUsuario,
    cambiarEstadoPerfilUsuario
}