import Plantilla_horarioModel from "../models/plantilla_horario.model.js";

const dbCreatePlantilla_horario = async (newPlantilla_horario) => {
    return await Plantilla_horarioModel.create(newPlantilla_horario);
}

// CAMBIO: ahora se puede filtrar por nivel -> /plantilla_horarios?nivel=ID
const dbGetPlantilla_horario = async (query = {}) => {
    const filter = {};
    if (query.nivel) filter.nivel = query.nivel;
    return await Plantilla_horarioModel.find(filter).populate('nivel');
}

const dbDeletePlantilla_horario = async (id) => {
    return await Plantilla_horarioModel.findOneAndDelete({ _id: id });
}

// CAMBIO: se usa findById + save() para que el validador de horaFin funcione
const dbUpdatePlantilla_horario = async (id, data) => {
    const doc = await Plantilla_horarioModel.findById(id);
    if (!doc) return null;

    doc.set(data);

    // Si solo cambian horaInicio, forzamos la comparación con horaFin
    if (data.horaInicio && !data.horaFin) doc.markModified('horaFin');

    return await doc.save();
}

const dbGetPlantilla_horarios = async (id) => {
    return await Plantilla_horarioModel.findOne({ _id: id }).populate('nivel');
}

export {
    dbCreatePlantilla_horario,
    dbGetPlantilla_horario,
    dbDeletePlantilla_horario,
    dbUpdatePlantilla_horario,
    dbGetPlantilla_horarios
}
