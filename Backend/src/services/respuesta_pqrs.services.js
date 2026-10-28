import Respuesta_pqrsModel from "../models/respuesta_pqrs.model.js";

const dbCreateRespuesta_pqrs = async (newRespuesta_pqrs) => {
    return await Respuesta_pqrsModel.create(newRespuesta_pqrs);
}

const dbGetRespuesta_pqrs = async () => {
    return await Respuesta_pqrsModel.find().populate('pqrs');
}

const dbDeleteRespuesta_pqrs = async (id) => {
    return await Respuesta_pqrsModel.findOneAndDelete({ _id: id});
}

const dbUpdateRespuesta_pqrs = async (id, respuesta_pqrsUpdate) => {
    return await Respuesta_pqrsModel.findOneAndUpdate({ _id: id}, respuesta_pqrsUpdate, {new: true});
}

const dbGetrespuesta_pqrs = async (id) => {
    return await Respuesta_pqrsModel.findOne({_id: id}).populate('pqrs');
}

export {
    dbCreateRespuesta_pqrs,
    dbGetRespuesta_pqrs,
    dbDeleteRespuesta_pqrs,
    dbUpdateRespuesta_pqrs,
    dbGetrespuesta_pqrs
}