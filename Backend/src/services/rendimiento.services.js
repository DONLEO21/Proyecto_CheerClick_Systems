import mongoose from "mongoose";
import RendimientoModel from "../models/rendimiento.models.js";
import AsistenciaModel from "../models/asistencia.model.js";
import HabilidadesModel from "../models/habilidades.model.js";
import { dbGetAtletas } from "./usuarios.services.js";
import { validarAccesoAtleta, validarAccesoNivel } from "../helpers/acceso.helpers.js";
import { errorHttp } from "../helpers/errores.helpers.js";
import { esFechaISO, fechaADate, hoyISO } from "../helpers/fecha.helpers.js";

// Estado actual = la última evaluación de cada habilidad por atleta
const ultimaCalificacion = (match = {}) => [
    { $match: match },
    { $sort: { fecha: -1, createdAt: -1 } },
    {
        $group: {
            _id: { usuario: '$usuario', habilidad: '$habilidad' },
            calificacion: { $first: '$calificacion' },
            observaciones: { $first: '$observaciones' },
            fecha: { $first: '$fecha' },
        },
    },
];

const dbGetRendimiento = async (query = {}, restriccion = {}) => {
    const filtro = {};
    if (query.usuario) filtro.usuario = query.usuario;
    if (query.asistencia) filtro.asistencia = query.asistencia;
    if (query.habilidad) filtro.habilidad = query.habilidad;

    return await RendimientoModel.find({ ...filtro, ...restriccion })
        .populate('habilidad', 'nombre estado nivel')
        .sort({ fecha: -1 })
        .lean();
};

// Habilidades con el estado del atleta + resumen + notas (lo que pide "Mi Rendimiento")
const dbGetRendimientoAtleta = async (atletaId) => {
    if (!mongoose.isValidObjectId(atletaId)) throw errorHttp(400, 'ID de atleta inválido');

    const [habilidades, ultimas, notas] = await Promise.all([
        HabilidadesModel.find({ estado: 'Activo' }).populate('tipoHabilidad').lean(),
        RendimientoModel.aggregate(ultimaCalificacion({ usuario: new mongoose.Types.ObjectId(String(atletaId)) })),
    ]);

    const porHabilidad = new Map(ultimas.map((u) => [String(u._id.habilidad), u]));
    const items = habilidades.map((h) => {
        const u = porHabilidad.get(String(h._id));
        return {
            ...h,
            completado: u?.calificacion ?? false,
            observaciones: u?.observaciones ?? null,
            fechaEvaluacion: u?.fecha ?? null,
        };
    });

    const completadas = items.filter((i) => i.completado).length;
    const porCategoria = {};
    for (const i of items) {
        const categoria = i.tipoHabilidad?.nombre ?? 'Sin tipo';
        porCategoria[categoria] ??= { total: 0, completadas: 0 };
        porCategoria[categoria].total++;
        if (i.completado) porCategoria[categoria].completadas++;
    }

    return {
        habilidades: items,
        resumen: {
            total: items.length,
            completadas,
            porcentaje: items.length ? Math.round((completadas / items.length) * 100) : 0,
            porCategoria,
        },
    };
};

// Lista de atletas con su % de rendimiento (tabla del admin). 
const dbGetResumenRendimiento = async (nivel) => {
    const atletas = await dbGetAtletas(nivel);
    const activas = await HabilidadesModel.distinct('_id', { estado: 'Activo' });

    const completadas = await RendimientoModel.aggregate([
        ...ultimaCalificacion({ habilidad: { $in: activas } }),
        { $match: { calificacion: true } },
        { $group: { _id: '$_id.usuario', completadas: { $sum: 1 } } },
    ]);
    const porUsuario = new Map(completadas.map((c) => [String(c._id), c.completadas]));

    return atletas.map((a) => {
        const hechas = porUsuario.get(String(a._id)) ?? 0;
        return {
            ...a,
            completadas: hechas,
            total: activas.length,
            rendimiento: activas.length ? Math.round((hechas / activas.length) * 100) : 0,
        };
    });
};

// Guarda de una vez los cambios del entrenador sobre un atleta 
const dbGuardarRendimientoAtleta = async (usuarioSesion, atletaId, { fecha, habilidades, nota } = {}) => {
    fecha = fecha ?? hoyISO();
    if (!esFechaISO(fecha)) throw errorHttp(400, 'La fecha debe tener formato AAAA-MM-DD');

    const lista = Array.isArray(habilidades) ? habilidades : [];
    const texto = nota?.trim() ?? '';
    if (lista.length === 0 && !texto) throw errorHttp(400, 'No hay cambios para guardar');

    await validarAccesoAtleta(usuarioSesion, atletaId);

    if (lista.length > 0) {
        // La evaluación se relaciona con la asistencia de ese día
        const asistencia = await AsistenciaModel.findOne({ usuario: atletaId, fecha });
        if (!asistencia) {
            throw errorHttp(400, `El atleta no tiene asistencia registrada el ${fecha}. Registra primero la asistencia.`);
        }
        if (['Inasistencia', 'Justificado'].includes(asistencia.tipoNovedad)) {
            throw errorHttp(400, 'No se puede evaluar a un atleta que no asistió ese día');
        }
        await validarAccesoNivel(usuarioSesion, asistencia.nivel);

        const ids = lista.map((h) => h.habilidad);
        if (ids.some((id) => !mongoose.isValidObjectId(id))) throw errorHttp(400, 'Hay una habilidad con ID inválido');
        if (lista.some((h) => typeof h.calificacion !== 'boolean')) throw errorHttp(400, 'La calificación debe ser true o false');

        const activas = await HabilidadesModel.countDocuments({ _id: { $in: ids }, estado: 'Activo' });
        if (activas !== new Set(ids.map(String)).size) {
            throw errorHttp(400, 'Hay habilidades que no existen o están inactivas');
        }

        await RendimientoModel.bulkWrite(lista.map((h) => ({
            updateOne: {
                filter: { asistencia: asistencia._id, habilidad: h.habilidad },
                update: {
                    $set: {
                        usuario: atletaId,
                        calificacion: h.calificacion,
                        observaciones: h.observaciones?.trim() || null,
                        fecha: fechaADate(fecha),
                    },
                },
                upsert: true,
            },
        })));
    }

    if (texto) {
        await NotaModel.create({ usuario: atletaId, autor: usuarioSesion._id, fecha, texto });
    }

    return await dbGetRendimientoAtleta(atletaId);
};

const dbCreateRendimiento = async (usuarioSesion, { asistencia: asistenciaId, habilidad, calificacion, observaciones } = {}) => {
    const asistencia = await AsistenciaModel.findById(asistenciaId);
    if (!asistencia) throw errorHttp(404, 'La asistencia no existe');
    if (['Inasistencia', 'Justificado'].includes(asistencia.tipoNovedad)) {
        throw errorHttp(400, 'No se puede evaluar a un atleta que no asistió');
    }
    await validarAccesoNivel(usuarioSesion, asistencia.nivel);

    const existe = await HabilidadesModel.exists({ _id: habilidad, estado: 'Activo' });
    if (!existe) throw errorHttp(400, 'La habilidad no existe o está inactiva');

    return await RendimientoModel.create({
        asistencia: asistencia._id,
        usuario: asistencia.usuario,
        habilidad,
        calificacion,
        observaciones,
        fecha: fechaADate(asistencia.fecha),
    });
};

const dbUpdateRendimiento = async (usuarioSesion, id, { calificacion, observaciones } = {}) => {
    const rendimiento = await RendimientoModel.findById(id);
    if (!rendimiento) return null;

    const asistencia = await AsistenciaModel.findById(rendimiento.asistencia);
    if (asistencia) await validarAccesoNivel(usuarioSesion, asistencia.nivel);

    if (calificacion !== undefined) rendimiento.calificacion = calificacion;
    if (observaciones !== undefined) rendimiento.observaciones = observaciones;
    return await rendimiento.save();
};

const dbDeleteRendimiento = async (usuarioSesion, id) => {
    const rendimiento = await RendimientoModel.findById(id);
    if (!rendimiento) return null;

    const asistencia = await AsistenciaModel.findById(rendimiento.asistencia);
    if (asistencia) await validarAccesoNivel(usuarioSesion, asistencia.nivel);

    await rendimiento.deleteOne();
    return rendimiento;
};

export {
    dbCreateRendimiento,
    dbGetRendimiento,
    dbGetRendimientoAtleta,
    dbGetResumenRendimiento,
    dbGuardarRendimientoAtleta,
    dbDeleteRendimiento,
    dbUpdateRendimiento
}