import HabilidadesModel from "../models/habilidades.model.js"

const dbGetHabilidades = async () => {
    return await HabilidadesModel.find().populate('tipoHabilidad')
}

const dbCreateHabilidad = async (newHabilidad) => {
    return await HabilidadesModel.create(newHabilidad)
}

const dbDeleteHabilidad = async (id) => {
    return await HabilidadesModel.findOneAndDelete({ _id: id})
}

const dbUpdateHabilidad = async (id, habilidadUpdate) => {
    return await HabilidadesModel.findOneAndUpdate(
        {_id: id},
        habilidadUpdate,
        {new : true}
    );
}

const dbGetHabilidad = async (id) => {
    return await HabilidadesModel.findOne({ _id: id }).populate('tipoHabilidad')
}

export {
    dbGetHabilidad,
    dbGetHabilidades,
    dbCreateHabilidad,
    dbUpdateHabilidad,
    dbDeleteHabilidad
}