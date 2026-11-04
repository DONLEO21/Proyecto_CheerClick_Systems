import HorarioModel from "../models/horario.model.js";
import NivelModel from "../models/nivel.model.js";

// El authMiddleware guarda el usuario en req.userFound.
// Si tu modelo de usuario usa otros nombres para el id o el rol, cámbialos aquí.
const getUserId = (user) => user?._id || user?.id;
const esEntrenador = (user) => {
    const rol = user?.rol; // puede ser texto o un objeto con nombre
    return (typeof rol === "object" ? rol?.nombre : rol) === "Entrenador";
};

// Error 403 (sin permiso). El controlador lo convierte en respuesta.
const errorSinPermiso = () => {
    const error = new Error('No tienes permiso sobre este nivel');
    error.status = 403;
    return error;
};

// El Administrador puede todo.
// El Entrenador solo puede si el nivel está asignado a él (Nivel.usuario).
const validarNivel = async (user, nivelId) => {
    if (!esEntrenador(user) || !nivelId) return;

    const nivel = await NivelModel.findOne({ _id: nivelId, usuario: getUserId(user) });
    if (!nivel) throw errorSinPermiso();
};

// Fecha en Colombia: si llega "2026-11-04" la guardamos a las 12:00 hora Colombia (UTC-5).
// Así nunca se corre de día (ni en UTC ni en Colombia).
const normalizarFecha = (data) => {
    if (typeof data.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) {
        return { ...data, fecha: new Date(`${data.fecha}T12:00:00-05:00`) };
    }
    return data;
};

const dbCreateHorario = async (newHorario, user) => {
    await validarNivel(user, newHorario.nivel);
    return await HorarioModel.create(normalizarFecha(newHorario));
}

// /horarios?nivel=ID  (el Entrenador solo recibe sus niveles)
const dbgetdHorario = async (query = {}, user) => {
    const filter = {};

    if (esEntrenador(user)) {
        if (query.nivel) {
            await validarNivel(user, query.nivel);
            filter.nivel = query.nivel;
        } else {
            const mios = await NivelModel.find({ usuario: getUserId(user) }, '_id');
            filter.nivel = { $in: mios.map((n) => n._id) };
        }
    } else if (query.nivel) {
        filter.nivel = query.nivel;
    }

    return await HorarioModel.find(filter).populate('nivel');
}

// findById + save() para que el validador de franjaFin funcione
const dbupdateHorario = async (id, data, user) => {
    const doc = await HorarioModel.findById(id);
    if (!doc) return null;

    await validarNivel(user, doc.nivel);          // el horario actual debe ser de su nivel
    if (data.nivel) await validarNivel(user, data.nivel); // y no puede moverlo a otro nivel

    doc.set(normalizarFecha(data));

    // Si solo cambia franjaInicio, forzamos la comparación con franjaFin
    if (data.franjaInicio && !data.franjaFin) doc.markModified('franjaFin');

    return await doc.save();
}

const dbdeleteHorario = async (id, user) => {
    const doc = await HorarioModel.findById(id);
    if (!doc) return null;

    await validarNivel(user, doc.nivel);
    return await doc.deleteOne();
}

const dbGetHorarios = async (id, user) => {
    const doc = await HorarioModel.findById(id);
    if (!doc) return null;

    await validarNivel(user, doc.nivel);
    return await doc.populate('nivel');
}

export {
    dbCreateHorario,
    dbgetdHorario,
    dbupdateHorario,
    dbdeleteHorario,
    dbGetHorarios
};
