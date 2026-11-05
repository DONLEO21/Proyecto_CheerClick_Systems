import Respuesta_pqrsModel from "../models/respuesta_pqrs.model.js";
import PqrsModel from "../models/pqrs.model.js";

const esAtleta = (user) => user?.rol === 'Atleta';
const errorHttp = (status, msg) => Object.assign(new Error(msg), { status });

// Etapas en las que el admin puede dejar la PQRS al responder (el select del modal)
const ETAPAS_RESPUESTA = ['En tramite', 'Resuelta'];

const dbCreateRespuesta_pqrs = async (newRespuesta_pqrs) => {
    const { etapa = 'En tramite', ...datosRespuesta } = newRespuesta_pqrs;

    if (!ETAPAS_RESPUESTA.includes(etapa)) {
        throw errorHttp(400, "La etapa debe ser 'En tramite' o 'Resuelta'");
    }

    if (datosRespuesta.pqrs) {
        const pqrs = await PqrsModel.findById(datosRespuesta.pqrs);

        if (!pqrs) throw errorHttp(404, 'Pqrs no encontrada');

        // En pantalla el botón "Responder" aparece deshabilitado cuando ya está resuelta
        if (pqrs.etapa === 'Resuelta') throw errorHttp(400, 'La Pqrs ya está resuelta');
    }

    const respuesta = await Respuesta_pqrsModel.create(datosRespuesta);

    await PqrsModel.updateOne({ _id: datosRespuesta.pqrs }, { etapa });

    return respuesta;
}

// CAMBIO:
// - /respuesta_pqrs?pqrs=ID trae las respuestas de una PQRS
// - El Atleta solo recibe respuestas de SUS pqrs activas (antes recibía las de todos)
const dbGetRespuesta_pqrs = async (query = {}, user) => {
    const filter = {};

    if (query.pqrs) filter.pqrs = query.pqrs;

    if (esAtleta(user)) {
        const mias = await PqrsModel.find({ usuario: user._id, estado: 'Activo' }, '_id');
        const ids = mias.map((p) => String(p._id));

        if (query.pqrs) {
            if (!ids.includes(String(query.pqrs))) return [];
        } else {
            filter.pqrs = { $in: ids };
        }
    }

    return await Respuesta_pqrsModel.find(filter)
        .populate('pqrs')
        .sort({ createdAt: -1 });
}

const dbDeleteRespuesta_pqrs = async (id) => {
    return await Respuesta_pqrsModel.findOneAndDelete({ _id: id });
}

// CAMBIO: runValidators para validar los datos al actualizar
const dbUpdateRespuesta_pqrs = async (id, respuesta_pqrsUpdate) => {
    return await Respuesta_pqrsModel.findOneAndUpdate(
        { _id: id },
        respuesta_pqrsUpdate,
        { new: true, runValidators: true }
    );
}

// CAMBIO: el Atleta solo puede ver la respuesta si la pqrs es suya y está activa
const dbGetrespuesta_pqrs = async (id, user) => {
    const respuesta = await Respuesta_pqrsModel.findOne({ _id: id }).populate('pqrs');
    if (!respuesta) return null;

    if (esAtleta(user)) {
        const pqrs = respuesta.pqrs;
        if (!pqrs || pqrs.estado !== 'Activo' || String(pqrs.usuario) !== String(user._id)) return null;
    }

    return respuesta;
}

export {
    dbCreateRespuesta_pqrs,
    dbGetRespuesta_pqrs,
    dbDeleteRespuesta_pqrs,
    dbUpdateRespuesta_pqrs,
    dbGetrespuesta_pqrs
}