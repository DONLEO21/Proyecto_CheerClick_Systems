import CompetenciaModel from "../models/competencia.model.js";

const dbCreateCompetencia = async (newCompetencia) => {
    return await CompetenciaModel.create(newCompetencia);
}


const dbGetCompetencia = async () => {
    return await CompetenciaModel.find();
}

const dbDeleteCompetencia = async (id) => {
    return await CompetenciaModel.findOneAndDelete({ _id: id});
    
}

const dbUpdateCompetencia = async (id, competenciaUpdate) => {
    return await CompetenciaModel.findOneAndUpdate({ _id: id}, competenciaUpdate, {new: true});
}

const dbGetCompetencias = async (id) => {
    return await CompetenciaModel.findOne({ _id: id});
}

export {
    dbGetCompetencia,
    dbCreateCompetencia,
    dbDeleteCompetencia,
    dbUpdateCompetencia, 
    dbGetCompetencias
}