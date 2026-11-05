import { dbCreateSolicitud, dbGetSolicitud, dbUpdateSolicitud } from "../services/solicitud.services.js";
import { responderError } from "../helpers/errores.helpers.js";

const createSolicitud = async (req, res) => {
    try {
        const { items } = req.body;   // PENDIENTE(pagos): leer aquí metodoPago / comprobante y pasarlos como tercer argumento
        const data = await dbCreateSolicitud(req.userFound._id, items);
        res.status(201).json({ msg: 'Registrar solicitud', data });
    } catch (error) {
        responderError(res, error, 'No se pudo registrar la solicitud');
    }
};

const getSolicitud = async (req, res) => {
    try {
        // El atleta solo ve las suyas; el admin ve todas
        const filtro = req.userFound.rol === 'Atleta' ? { usuario: req.userFound._id } : {};
        const data = await dbGetSolicitud(filtro);
        res.status(200).json({ msg: 'Lista de solicitudes', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar solicitudes');
    }
};

const updateSolicitud = async (req, res) => {
    try {
        const data = await dbUpdateSolicitud(req.params.id, req.userFound, req.body);
        if (!data) return res.status(404).json({ msg: 'No se encontró la solicitud' });
        res.status(200).json({ msg: 'Actualizar solicitud', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar la solicitud');
    }
};

export { createSolicitud, getSolicitud, updateSolicitud };