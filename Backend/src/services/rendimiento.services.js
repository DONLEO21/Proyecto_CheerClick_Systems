import RendimientoModel from "../models/rendimiento.models.js";

const dbCreateRendimiento = async (newRendimiento) => {
    return await RendimientoModel.create(newRendimiento); 
}

const dbGetRendimiento = async () => {
    return await RendimientoModel.find(); 
}

const dbDeleteRendimiento = async (id) => {
    return await RendimientoModel.findOneAndDelete({ _id: id })
}

const dbUpdateRendimiento = async (id, rendimientoUpdate) => {
    return await RendimientoModel.findByIdAndUpdate(
        id,                 
        rendimientoUpdate,      
        { new: true, runValidators: true }   
    );
}

export {
    dbCreateRendimiento,
    dbGetRendimiento,
    dbDeleteRendimiento,
    dbUpdateRendimiento
}