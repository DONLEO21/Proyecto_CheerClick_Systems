import { dbCreateResena, dbGetResena, dbUpdateResena } from "../services/resena.services.js";
import { responderError } from "../helpers/errores.helpers.js";

const createResena = async (req, res) => {
    try {
        const data = await dbCreateResena(req.userFound._id, req.body);
        res.status(201).json({ msg: 'Registrar reseña', data });
    } catch (error) {
        responderError(res, error, 'No se pudo registrar la reseña');
    }
};

const getResena = async (req, res) => {
    try {
        const data = await dbGetResena();
        res.status(200).json({ msg: 'Lista de reseñas', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar reseñas');
    }
};

const updateResena = async (req, res) => {
    try {
        const data = await dbUpdateResena(req.params.id, req.userFound._id, req.body);
        if (!data) return res.status(404).json({ msg: 'No se encontró la reseña' });
        res.status(200).json({ msg: 'Actualizar reseña', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar la reseña');
    }
};

export { createResena, getResena, updateResena };