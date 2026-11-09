import {
    dbCreateAsistencia, dbDeleteAsistencia, dbGetAsistencia,
    dbGetPlanilla, dbGuardarAsistenciaDia, dbUpdateAsistencia
} from "../services/asistencia.services.js";
import { responderError } from "../helpers/errores.helpers.js";
import { filtroAsistenciaPorRol } from "../helpers/acceso.helpers.js";

const createAsistencia = async (req, res) => {
    try {
        const data = await dbCreateAsistencia(req.userFound, req.body);
        res.status(201).json({ msg: 'Registrar asistencia', data });
    } catch (error) {
        responderError(res, error, 'No se pudo registrar la asistencia');
    }
};

// PUT /api/asistencia/dia  { nivel, fecha, registros: [{ usuario, tipoNovedad, motivo? }] }
const guardarAsistenciaDia = async (req, res) => {
    try {
        const data = await dbGuardarAsistenciaDia(req.userFound, req.body);
        res.status(200).json({ msg: 'Asistencia del día guardada', data });
    } catch (error) {
        responderError(res, error, 'No se pudo guardar la asistencia del día');
    }
};

// GET /api/asistencia/planilla?nivel=&fecha=
const getPlanilla = async (req, res) => {
    try {
        const data = await dbGetPlanilla(req.userFound, req.query.nivel, req.query.fecha);
        res.status(200).json({ msg: 'Planilla de asistencia', data });
    } catch (error) {
        responderError(res, error, 'No se pudo obtener la planilla de asistencia');
    }
};

// GET /api/asistencia?usuario=&nivel=&fecha=&desde=&hasta=
const getAsistencia = async (req, res) => {
    try {
        const restriccion = await filtroAsistenciaPorRol(req.userFound, req.query.nivel);
        const data = await dbGetAsistencia(req.query, restriccion);
        res.status(200).json({ msg: 'Lista de asistencias', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar asistencias');
    }
};

const updateAsistencia = async (req, res) => {
    try {
        const data = await dbUpdateAsistencia(req.userFound, req.params.id, req.body);
        if (!data) return res.status(404).json({ msg: 'No se encontró la asistencia' });
        res.status(200).json({ msg: 'Actualizar asistencia', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar la asistencia');
    }
};

const deleteAsistencia = async (req, res) => {
    try {
        const data = await dbDeleteAsistencia(req.userFound, req.params.id);
        if (!data) return res.status(404).json({ msg: 'No se encontró la asistencia' });
        res.status(200).json({ msg: 'Eliminar asistencia', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido eliminar la asistencia');
    }
};

export {
    createAsistencia,
    getAsistencia,
    getPlanilla,
    guardarAsistenciaDia,
    updateAsistencia,
    deleteAsistencia
}