import {
    dbCreateJustificacion, dbDeleteJustificacion, dbGetJustificacion, dbUpdateJustificacion
} from "../services/justificacion.services.js";
import { responderError } from "../helpers/errores.helpers.js";
import { filtroAsistenciaPorRol } from "../helpers/acceso.helpers.js";
import { guardarArchivoBase64, borrarArchivo } from "../helpers/archivo.helpers.js";

const createJustificacion = async (req, res) => {
    let archivo = null;
    try {
        archivo = await guardarArchivoBase64(req.body.archivo);
        const data = await dbCreateJustificacion(req.userFound, req.body, archivo);
        res.status(201).json({ msg: 'Registrar justificación', data });
    } catch (error) {
        borrarArchivo(archivo);   // no deja archivos huérfanos
        responderError(res, error, 'No se pudo registrar la justificación');
    }
};

const getJustificacion = async (req, res) => {
    try {
        const restriccion = await filtroAsistenciaPorRol(req.userFound, req.query.nivel);
        const data = await dbGetJustificacion(req.query, restriccion);
        res.status(200).json({ msg: 'Lista de justificaciones', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar justificaciones');
    }
};

const updateJustificacion = async (req, res) => {
    try {
        const data = await dbUpdateJustificacion(req.userFound, req.params.id, req.body);
        if (!data) return res.status(404).json({ msg: 'No se encontró la justificación' });
        res.status(200).json({ msg: 'Actualizar justificación', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar la justificación');
    }
};

const deleteJustificacion = async (req, res) => {
    try {
        const data = await dbDeleteJustificacion(req.params.id);
        if (!data) return res.status(404).json({ msg: 'No se encontró la justificación' });
        res.status(200).json({ msg: 'Eliminar justificación', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido eliminar la justificación');
    }
};

export {
    createJustificacion,
    getJustificacion,
    updateJustificacion,
    deleteJustificacion
}