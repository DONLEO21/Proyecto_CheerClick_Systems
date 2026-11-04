import AsistenciaModel from "../models/asistencia.model.js";

const dbCreateAsistencia = async (newAsistencia) => {
    return await AsistenciaModel.create(newAsistencia); //Registra en la bd
}

// Sin populate: usuario y horario aún no tienen modelo. Cuando existan, agregar .populate('usuario').populate('horario')
const dbGetAsistencia = async () => {
    return await AsistenciaModel.find(); //Consultar todos los registros
}

const dbDeleteAsistencia = async (id) => {
    return await AsistenciaModel.findOneAndDelete({ _id: id })
}

const dbUpdateAsistencia = async (id, asistenciaUpdate) => {
    return await AsistenciaModel.findByIdAndUpdate(
        id,                  //El id del documento que deseamos actualizar
        asistenciaUpdate,        //El objeto con los datos que deseamos actualizar
        { new: true, runValidators: true }   //Retorna el documento actualizado y valida las reglas
    );
}

export {
    dbCreateAsistencia,
    dbGetAsistencia,
    dbDeleteAsistencia,
    dbUpdateAsistencia
}
