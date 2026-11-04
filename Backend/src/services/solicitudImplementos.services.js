import SolicitudImplementosModel from "../models/solicitudImplementos.model.js";

const dbCreateSolicitudImplementos = async (newSolicitudImplementos) => {
    return await SolicitudImplementosModel.create(newSolicitudImplementos); 
}

const dbGetSolicitudImplementos = async () => {
    return await SolicitudImplementosModel.find().populate('solicitud').populate('implemento');
}

const dbDeleteSolicitudImplementos = async (id) => {
    return await SolicitudImplementosModel.findOneAndDelete({ _id: id })
}

const dbUpdateSolicitudImplementos = async (id, solicitudImplementosUpdate) => {
    return await SolicitudImplementosModel.findByIdAndUpdate(
        id,                 
        solicitudImplementosUpdate,  
        { new: true, runValidators: true }  
    );
}

export {
    dbCreateSolicitudImplementos,
    dbGetSolicitudImplementos,
    dbDeleteSolicitudImplementos,
    dbUpdateSolicitudImplementos
}