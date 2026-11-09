import mongoose from "mongoose";
import AsistenciaModel, { TIPOS_NOVEDAD } from "../models/asistencia.model.js";
import JustificacionModel from "../models/justificacion.model.js";
import RendimientoModel from "../models/rendimiento.models.js";
import { dbGetAtletas } from "./usuarios.services.js";
import { validarAccesoNivel } from "../helpers/acceso.helpers.js";
import { errorHttp } from "../helpers/errores.helpers.js";
import { esFechaISO, hoyISO } from "../helpers/fecha.helpers.js";

// Mantiene coherente la justificación con la novedad de la asistencia
const sincronizarJustificacion = async (asistencia, nuevoTipo, { motivo, revisorId } = {}) => {
    const existente = await JustificacionModel.findOne({ asistencia: asistencia._id });

    if (nuevoTipo === 'Justificado') {
        if (!existente) {
            const texto = motivo?.trim();
            const motivoFinal = !texto
                ? 'Justificado por el entrenador'
                : texto.length >= 10 ? texto : `Justificado por el entrenador: ${texto}`;

            await JustificacionModel.create({
                asistencia: asistencia._id,
                motivo: motivoFinal.slice(0, 250),
                estado: 'Aprobada',
                revisor: revisorId,
                fechaRevision: new Date(),
            });
        } else if (existente.estado !== 'Aprobada') {
            existente.estado = 'Aprobada';
            existente.revisor = revisorId;
            existente.fechaRevision = new Date();
            await existente.save();
        }
        return;
    }

    // Si dejó de estar justificada, la justificación aprobada ya no aplica
    if (existente && existente.estado === 'Aprobada') {
        existente.estado = 'Rechazada';
        existente.observaciones = 'Se cambió el estado de la asistencia';
        existente.revisor = revisorId;
        existente.fechaRevision = new Date();
        await existente.save();
    }
};

const adjuntarJustificacion = async (asistencias) => {
    const justificaciones = await JustificacionModel
        .find({ asistencia: { $in: asistencias.map((a) => a._id) } })
        .select('asistencia estado motivo observaciones archivoNombre fechaRevision')
        .lean();
    const mapa = new Map(justificaciones.map((j) => [String(j.asistencia), j]));
    return asistencias.map((a) => ({ ...a, justificacion: mapa.get(String(a._id)) ?? null }));
};

//PENDIENTE POR CONECTAR CON EL MODELO DE HORARIO Y NIVEL
// Sesión (Horario) activa del nivel en ese día. Horario.fecha es Date, así que se busca en todo el día UTC
const buscarHorario = async (nivel, fecha) => {
    const inicio = new Date(`${fecha}T00:00:00.000Z`);
    const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
    return await HorarioModel
        .findOne({ nivel, estado: 'Activo', fecha: { $gte: inicio, $lt: fin } })
        .sort({ franjaInicio: 1 })
        .lean();
};

const validarNivelActivo = async (nivelId) => {
    const nivel = await NivelModel.findById(nivelId).lean();
    if (!nivel) throw errorHttp(404, 'El nivel no existe');
    if (nivel.estado !== 'Activo') throw errorHttp(400, 'El nivel está inactivo');
    return nivel;
};

const dbGetAsistencia = async (query = {}, restriccion = {}) => {
    const filtro = {};
    if (query.usuario) filtro.usuario = query.usuario;
    if (query.nivel) filtro.nivel = query.nivel;
    if (query.fecha) filtro.fecha = query.fecha;
    if (query.desde || query.hasta) {
        filtro.fecha = {
            ...(query.desde && { $gte: query.desde }),
            ...(query.hasta && { $lte: query.hasta }),
        };
    }

    const asistencias = await AsistenciaModel.find({ ...filtro, ...restriccion })
        .populate('usuario', 'nombre apellido')
        .populate('nivel', 'nombre imagenEntre estado')
        .populate('horario', 'enfoque lugar tipo franjaInicio franjaFin')
        .sort({ fecha: -1 })
        .lean();

    return await adjuntarJustificacion(asistencias);
};

// Atletas del nivel con la asistencia del día (pantalla "Tomar asistencia")
const dbGetPlanilla = async (usuarioSesion, nivel, fecha) => {
    if (!nivel || !esFechaISO(fecha)) throw errorHttp(400, 'Se requiere nivel y fecha (AAAA-MM-DD)');
    await validarAccesoNivel(usuarioSesion, nivel);
    const nivelDoc = await validarNivelActivo(nivel);

    const [atletas, registros, horario] = await Promise.all([
        dbGetAtletas(nivel),
        AsistenciaModel.find({ nivel, fecha }).lean(),
        buscarHorario(nivel, fecha),
    ]);
    const porUsuario = new Map(registros.map((r) => [String(r.usuario), r]));

    return {
        nivel: nivelDoc,
        fecha,
        horario,   // null si ese día no hay sesión programada
        atletas: atletas.map((a) => ({ usuario: a, asistencia: porUsuario.get(String(a._id)) ?? null })),
    };
};

// Guarda el día completo de un nivel. Los atletas no enviados quedan como Inasistencia
const dbGuardarAsistenciaDia = async (usuarioSesion, { nivel, fecha, registros } = {}) => {
    if (!nivel) throw errorHttp(400, 'El nivel es obligatorio');
    if (!esFechaISO(fecha)) throw errorHttp(400, 'La fecha debe tener formato AAAA-MM-DD');
    if (fecha > hoyISO()) throw errorHttp(400, 'No se puede registrar asistencia de una fecha futura');
    if (!Array.isArray(registros) || registros.length === 0) throw errorHttp(400, 'Debe enviar al menos un registro');

    await validarAccesoNivel(usuarioSesion, nivel);
    await validarNivelActivo(nivel);

    const atletas = await dbGetAtletas(nivel);
    const idsNivel = new Set(atletas.map((a) => String(a._id)));

    const porUsuario = new Map();
    for (const r of registros) {
        if (!mongoose.isValidObjectId(r.usuario)) throw errorHttp(400, 'Hay un usuario con ID inválido');
        if (!TIPOS_NOVEDAD.includes(r.tipoNovedad)) throw errorHttp(400, `Tipo de novedad inválido: ${r.tipoNovedad}`);
        if (idsNivel.size > 0 && !idsNivel.has(String(r.usuario))) {
            throw errorHttp(400, 'Hay un atleta que no pertenece a este nivel');
        }
        porUsuario.set(String(r.usuario), r);
    }
    for (const id of idsNivel) {
        if (!porUsuario.has(id)) porUsuario.set(id, { usuario: id, tipoNovedad: 'Inasistencia' });
    }

    const horario = await buscarHorario(nivel, fecha);   // PENDIENTE
    const lista = [...porUsuario.values()];

    await AsistenciaModel.bulkWrite(lista.map((r) => ({
        updateOne: {
            filter: { usuario: r.usuario, nivel, fecha },
            update: { $set: { tipoNovedad: r.tipoNovedad, horario: horario?._id ?? null } },
            upsert: true,
        },
    })));

    const guardadas = await AsistenciaModel.find({ nivel, fecha, usuario: { $in: lista.map((r) => r.usuario) } });
    for (const a of guardadas) {
        await sincronizarJustificacion(a, a.tipoNovedad, {
            motivo: porUsuario.get(String(a.usuario))?.motivo,
            revisorId: usuarioSesion._id,
        });
    }

    return await dbGetAsistencia({ nivel, fecha });
};

const dbCreateAsistencia = async (usuarioSesion, { usuario, nivel, fecha, tipoNovedad, motivo } = {}) => {
    if (!nivel) throw errorHttp(400, 'El nivel es obligatorio');
    if (!esFechaISO(fecha)) throw errorHttp(400, 'La fecha debe tener formato AAAA-MM-DD');
    await validarAccesoNivel(usuarioSesion, nivel);
    await validarNivelActivo(nivel);

    const horario = await buscarHorario(nivel, fecha);
    const asistencia = await AsistenciaModel.create({ usuario, nivel, fecha, tipoNovedad, horario: horario?._id ?? null });
    await sincronizarJustificacion(asistencia, asistencia.tipoNovedad, { motivo, revisorId: usuarioSesion._id });
    return asistencia;
};

const dbUpdateAsistencia = async (usuarioSesion, id, { tipoNovedad, motivo } = {}) => {
    if (!TIPOS_NOVEDAD.includes(tipoNovedad)) {
        throw errorHttp(400, `El tipo de novedad debe ser: ${TIPOS_NOVEDAD.join(', ')}`);
    }
    const asistencia = await AsistenciaModel.findById(id);
    if (!asistencia) return null;

    await validarAccesoNivel(usuarioSesion, asistencia.nivel);

    asistencia.tipoNovedad = tipoNovedad;   // solo se permite cambiar la novedad
    await asistencia.save();
    await sincronizarJustificacion(asistencia, tipoNovedad, { motivo, revisorId: usuarioSesion._id });
    return asistencia;
};

const dbDeleteAsistencia = async (usuarioSesion, id) => {
    const asistencia = await AsistenciaModel.findById(id);
    if (!asistencia) return null;

    await validarAccesoNivel(usuarioSesion, asistencia.nivel);

    await asistencia.deleteOne();
    await JustificacionModel.deleteMany({ asistencia: id });
    await RendimientoModel.deleteMany({ asistencia: id });
    return asistencia;
};

export {
    dbCreateAsistencia,
    dbGetAsistencia,
    dbGetPlanilla,
    dbGuardarAsistenciaDia,
    dbDeleteAsistencia,
    dbUpdateAsistencia
}