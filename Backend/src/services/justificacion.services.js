import JustificacionModel from "../models/justificacion.model.js";

const dbCreateJustificacion = async (newJustificacion) => {
    return await JustificacionModel.create(newJustificacion); //Registra en la bd
}

// Sin populate de revisor: el modelo 'usuario' aún no existe. Cuando exista, agregar .populate('revisor')
const dbGetJustificacion = async () => {
    return await JustificacionModel.find().populate('asistencia'); //Consultar todos los registros
}

const dbDeleteJustificacion = async (id) => {
    return await JustificacionModel.findOneAndDelete({ _id: id })
}

const dbUpdateJustificacion = async (id, justificacionUpdate) => {
    return await JustificacionModel.findByIdAndUpdate(
        id,                  //El id del documento que deseamos actualizar
        justificacionUpdate,        //El objeto con los datos que deseamos actualizar
        { new: true, runValidators: true }   //Retorna el documento actualizado y valida las reglas
    );
}

export {
    dbCreateJustificacion,
    dbGetJustificacion,
    dbDeleteJustificacion,
    dbUpdateJustificacion
}
