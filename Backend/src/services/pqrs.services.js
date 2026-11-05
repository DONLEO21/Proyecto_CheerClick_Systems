import PqrsModel from "../models/pqrs.model.js";

const esAtleta = (user) => user?.rol === 'Atleta';

const dbCreatePqrs = async (newPqrs) => {
    const ultima = await PqrsModel.findOne().sort({ numero: -1 }).select('numero');
    const numero = (ultima?.numero || 0) + 1;

    return await PqrsModel.create({ ...newPqrs, numero });
}

// CAMBIO:
// - Administrador: ve todas (activas e inactivas) con el nombre del remitente
// - Atleta: solo las SUYAS y ACTIVAS (antes veía las de todos)
const dbGetPqrs = async (user) => {
    const filter = esAtleta(user) ? { usuario: user._id, estado: 'Activo' } : {};

    return await PqrsModel.find(filter)
        .populate('usuario', 'nombre apellido')   // ajusta a los campos reales de tu modelo de usuarios
        .sort({ createdAt: -1 });
}

// CAMBIO: runValidators para validar los datos al actualizar
const dbUpdatePqrs = async (id, PqrsUpdate) => {
    return await PqrsModel.findOneAndUpdate(
        { _id: id },
        PqrsUpdate,
        { new: true, runValidators: true }
    );
}

// CAMBIO: el Atleta solo puede ver una PQRS si es suya y está activa (antes podía ver cualquiera por ID)
const dbGetpqrs = async (id, user) => {
    const filter = { _id: id };
    if (esAtleta(user)) {
        filter.usuario = user._id;
        filter.estado = 'Activo';
    }

    return await PqrsModel.findOne(filter).populate('usuario', 'nombre apellido');
}

export {
    dbCreatePqrs,
    dbGetPqrs,
    dbUpdatePqrs,
    dbGetpqrs
}