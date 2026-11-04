import SolicitudModel from "../models/solicitud.model.js";

const dbCreateSolicitud = async (newSolicitud) => {
    return await SolicitudModel.create(newSolicitud); 
}

const dbGetSolicitud = async () => {
    return await SolicitudModel.find().populate('usuario');
}

const dbDeleteSolicitud = async (id) => {
    return await SolicitudModel.findOneAndDelete({ _id: id })
}

const dbUpdateSolicitud = async (id, solicitudUpdate) => {
    return await SolicitudModel.findByIdAndUpdate(
        id,                 
        solicitudUpdate,   
        { new: true, runValidators: true }  
    );
}

export {
    dbCreateSolicitud,
    dbGetSolicitud,
    dbDeleteSolicitud,
    dbUpdateSolicitud
}