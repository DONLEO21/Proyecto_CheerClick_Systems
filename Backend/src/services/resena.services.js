import ResenaModel from "../models/resena.model.js";

const dbCreateResena = async (newResena) => {
    return await ResenaModel.create(newResena); 
}

const dbGetResena = async () => {
    return await ResenaModel.find().populate('solicitud');
}

const dbDeleteResena = async (id) => {
    return await ResenaModel.findOneAndDelete({ _id: id })
}

const dbUpdateResena = async (id, resenaUpdate) => {
    return await ResenaModel.findByIdAndUpdate(
        id,                 
        resenaUpdate,  
        { new: true, runValidators: true }   
    );
}

export {
    dbCreateResena,
    dbGetResena,
    dbDeleteResena,
    dbUpdateResena
}