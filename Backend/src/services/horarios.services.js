import HorarioModel from "../models/horario.model.js";

const dbCreateHorario = async (newHorario) => {
    return await HorarioModel.create(newHorario);
}

const dbgetdHorario = async () => {
    return await HorarioModel.find().populate('nivel');
}

const dbupdateHorario = async (id, horarioUpdate) => {
    return await HorarioModel.findOneAndUpdate(
        { _id: id },
        horarioUpdate,
        { 
            returnDocument: 'after', // Corregido: Reemplaza a { new: true } para evitar el warning
            runValidators: true      // Ejecuta todas las validaciones del Schema
        }
    );
}

const dbdeleteHorario = async (id) => {
    return await HorarioModel.findOneAndDelete({ _id: id });
}

const dbGetHorarios = async (id) => {
    return await HorarioModel.findOne({ _id: id})
}


export {
    dbCreateHorario,
    dbgetdHorario,
    dbupdateHorario,
    dbdeleteHorario,
    dbGetHorarios
};