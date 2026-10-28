import Inscripciones_competenciasModel from "../models/inscripcion_competencia.model.js";

const dbCreateInscripcion_competencia = async (newInscripcion_competencia) => {
    return await Inscripciones_competenciasModel.create(newInscripcion_competencia)
}

const dbGetInscripcion_competencia = async () => {
    return await Inscripciones_competenciasModel.find().populate('competencia').populate('usuario').populate('pago');
}

const dbUpdateInscripcion_competencia = async (id, inscripcion_competenciaUpdate) => {
    return await Inscripciones_competenciasModel.findOneAndUpdate({ _id: id}, inscripcion_competenciaUpdate, {new: true});
}

const dbDeleteInscripcion_competencia = async (id) => {
    return await Inscripciones_competenciasModel.findOneAndDelete({ _id: id});
}

const dbGetInscripciones_competencias = async (id) => {
    return await Inscripciones_competenciasModel.findOne({ _id: id}).populate('competencia').populate('usuario').populate('pago');
}


export { 
    dbCreateInscripcion_competencia,
    dbGetInscripcion_competencia,
    dbUpdateInscripcion_competencia,
    dbDeleteInscripcion_competencia,
    dbGetInscripciones_competencias
}