import Plantilla_horarioModel from "../models/plantilla_horario.model.js"

const dbCreatePlantilla_horario = async (newPlantilla_horario) => {
    return await Plantilla_horarioModel.create(newPlantilla_horario);  // Registrar en la base de datos
}

const dbGetPlantilla_horario = async () => {
   return await Plantilla_horarioModel.find().populate('nivel');     // Consultar todas las plantillas de horarios
}

const dbDeletePlantilla_horario = async (id) => {
    //   return await Plantilla_horarioModel.findByIdAndDelete(id);

    return await Plantilla_horarioModel.findOneAndDelete({ _id: id});

}

const dbUpdatePlantilla_horario = async (id, plantilla_horarioUpdate) => {
    // return await Plantilla_horarioModel.findByIdAndUpdate(
    //     id,                           // El ID del Documento que deseamos actualizar 
    //     plantilla_horarioUpdate,       // EL objeto con los datos del Documento que deseamos actualizar 
    //     {new: true}

       return await Plantilla_horarioModel.findOneAndUpdate(
        { _id: id} ,                           // El ID del Documento que deseamos actualizar 
        plantilla_horarioUpdate,       // EL objeto con los datos del Documento que deseamos actualizar 
        {new: true}
    );
}

const dbGetPlantilla_horarios = async (id) => {
    // return await Plantilla_horarioModel.findById(id);
    
    return await Plantilla_horarioModel.findOne({ _id: id}).populate('nivel');
}

export {
    dbCreatePlantilla_horario,
    dbGetPlantilla_horario,
    dbDeletePlantilla_horario,
    dbUpdatePlantilla_horario,
    dbGetPlantilla_horarios
}