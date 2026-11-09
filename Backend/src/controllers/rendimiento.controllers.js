import {
    dbCreateRendimiento, dbDeleteRendimiento, dbGetRendimiento, dbGetRendimientoAtleta,
    dbGetResumenRendimiento, dbGuardarRendimientoAtleta, dbUpdateRendimiento
} from "../services/rendimiento.services.js";
import { responderError } from "../helpers/errores.helpers.js";
import { nivelesDelEntrenador, validarAccesoAtleta, validarAccesoNivel } from "../helpers/acceso.helpers.js";

// "me" = el usuario del token (el atleta no necesita conocer su propio id)
const resolverAtletaId = (req) => (req.params.id === 'me' ? String(req.userFound._id) : req.params.id);

const createRendimiento = async (req, res) => {
    try {
        const data = await dbCreateRendimiento(req.userFound, req.body);
        res.status(201).json({ msg: 'Registrar rendimiento', data });
    } catch (error) {
        responderError(res, error, 'No se pudo registrar el rendimiento');
    }
};

const getRendimiento = async (req, res) => {
    try {
        const restriccion = req.userFound.rol === 'Atleta' ? { usuario: req.userFound._id } : {};
        const data = await dbGetRendimiento(req.query, restriccion);
        res.status(200).json({ msg: 'Lista de rendimientos', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar rendimientos');
    }
};

// GET /api/rendimiento/atleta/:id   (id o "me")
const getRendimientoAtleta = async (req, res) => {
    try {
        const atletaId = resolverAtletaId(req);
        await validarAccesoAtleta(req.userFound, atletaId);
        const data = await dbGetRendimientoAtleta(atletaId);
        res.status(200).json({ msg: 'Rendimiento del atleta', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido obtener el rendimiento del atleta');
    }
};

// GET /api/rendimiento/resumen?nivel=
const getResumenRendimiento = async (req, res) => {
    try {
        let nivel = req.query.nivel;
        if (req.userFound.rol === 'Entrenador') {
            if (nivel) {
                await validarAccesoNivel(req.userFound, nivel);
            } else {
                const propios = await nivelesDelEntrenador(req.userFound._id);
                if (propios) nivel = { $in: propios };
            }
        }
        const data = await dbGetResumenRendimiento(nivel);
        res.status(200).json({ msg: 'Resumen de rendimiento', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido obtener el resumen de rendimiento');
    }
};

// PUT /api/rendimiento/atleta/:id  { fecha?, habilidades: [{ habilidad, calificacion, observaciones? }], nota? }
const guardarRendimientoAtleta = async (req, res) => {
    try {
        const data = await dbGuardarRendimientoAtleta(req.userFound, req.params.id, req.body);
        res.status(200).json({ msg: 'Rendimiento guardado', data });
    } catch (error) {
        responderError(res, error, 'No se pudo guardar el rendimiento');
    }
};

const updateRendimiento = async (req, res) => {
    try {
        const data = await dbUpdateRendimiento(req.userFound, req.params.id, req.body);
        if (!data) return res.status(404).json({ msg: 'No se encontró el rendimiento' });
        res.status(200).json({ msg: 'Actualizar rendimiento', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar el rendimiento');
    }
};

const deleteRendimiento = async (req, res) => {
    try {
        const data = await dbDeleteRendimiento(req.userFound, req.params.id);
        if (!data) return res.status(404).json({ msg: 'No se encontró el rendimiento' });
        res.status(200).json({ msg: 'Eliminar rendimiento', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido eliminar el rendimiento');
    }
};

export {
    createRendimiento,
    getRendimiento,
    getRendimientoAtleta,
    getResumenRendimiento,
    guardarRendimientoAtleta,
    updateRendimiento,
    deleteRendimiento
}