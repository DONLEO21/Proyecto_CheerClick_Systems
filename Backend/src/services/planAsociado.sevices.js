import PlanAsociadoModel from "../models/planAsociado.model.js";

const dbCreatePlanAsociado = async (newPlanAsociado) => {
    return await PlanAsociadoModel.create( newPlanAsociado);
}

const dbGetPlanAsociado = async () => {
    return await PlanAsociadoModel.find();
}

const dbDeletePlanAsociado = async (id) => {
    return await PlanAsociadoModel.findOneAndDelete({ _id: id})
}

const dbUpdatePlanAsociado = async (id, planAsociadoUpdate) => {

    return await PlanAsociadoModel.findOneAndUpdate(
        { _id: id},
        planAsociadoUpdate,
        {new: true}
    );
}

const dbGetPlanesAsociados = async (id) => {

    return await PlanAsociadoModel.findOne({_id: id})
}

export {
    dbCreatePlanAsociado,
    dbGetPlanAsociado, 
    dbDeletePlanAsociado,
    dbUpdatePlanAsociado,
    dbGetPlanesAsociados
}