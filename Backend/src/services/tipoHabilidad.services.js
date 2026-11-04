import TipoHabilidadModel from "../models/tipoHabilidad.model.js"

const dbGetTipoHabilidades = async () => {
    return await TipoHabilidadModel.find()
}

const dbCreateTipoHabilidad = async (newTipoHabilidad) => {
    return await TipoHabilidadModel.create(newTipoHabilidad)
}

const dbDeleteTipoHabilidad = async (id) => {
    return await TipoHabilidadModel.findOneAndDelete({ _id: id})
}

const dbUpdateTipoHabilidad = async (id, tipoHabilidadUpdate) => {
    return await TipoHabilidadModel.findOneAndUpdate(
        {_id: id},
        tipoHabilidadUpdate,
        {new : true}
    );
}

const dbGetTipoHabilidad = async (id) => {
    return await TipoHabilidadModel.findOne({_id: id})
}

export {
    dbGetTipoHabilidad,
    dbGetTipoHabilidades,
    dbUpdateTipoHabilidad,
    dbDeleteTipoHabilidad,
    dbCreateTipoHabilidad
}