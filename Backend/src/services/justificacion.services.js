import JustificacionModel from "../models/justificacion.model.js";
import AsistenciaModel from "../models/asistencia.model.js";
import { validarAccesoNivel } from "../helpers/acceso.helpers.js";
import { errorHttp } from "../helpers/errores.helpers.js";

const rutaAsistencia = () => ({
    path: 'asistencia',
    select: 'usuario nivel horario fecha tipoNovedad',
    populate: [
        { path: 'usuario', select: 'nombre apellido' },
        { path: 'nivel', select: 'nombre imagenEntre estado' },
        { path: 'horario', select: 'franjaInicio franjaFin lugar' },
    ],
});

// fechaAusencia = día de la falta 
const formatear = (j) => ({
    ...j,
    fechaAusencia: j.asistencia?.fecha ?? null,
    atleta: j.asistencia?.usuario ?? null,
    nivel: j.asistencia?.nivel ?? null,
    horaInicio: j.asistencia?.horario?.franjaInicio ?? null,
    horaFin: j.asistencia?.horario?.franjaFin ?? null,
});

const buscarFormateada = async (id) => {
    const j = await JustificacionModel.findById(id)
        .populate(rutaAsistencia())
        .populate('revisor', 'nombre apellido')
        .lean();
    return j ? formatear(j) : null;
};

const dbGetJustificacion = async (query = {}, restriccion = {}) => {
    const filtro = {};
    if (query.estado) filtro.estado = query.estado;

    const filtroAsistencia = { ...restriccion };
    if (query.nivel && !filtroAsistencia.nivel) filtroAsistencia.nivel = query.nivel;
    if (query.usuario && !filtroAsistencia.usuario) filtroAsistencia.usuario = query.usuario;
    if (Object.keys(filtroAsistencia).length > 0) {
        filtro.asistencia = { $in: await AsistenciaModel.distinct('_id', filtroAsistencia) };
    }

    const lista = await JustificacionModel.find(filtro)
        .populate(rutaAsistencia())
        .populate('revisor', 'nombre apellido')
        .sort({ createdAt: -1 })
        .lean();
    return lista.map(formatear);
};

const dbCreateJustificacion = async (usuarioSesion, { asistencia: asistenciaId, motivo } = {}, archivo = null) => {
    if (!asistenciaId) throw errorHttp(400, 'La asistencia es obligatoria');
    if ((motivo?.trim() ?? '').length < 10) throw errorHttp(400, 'El motivo debe tener al menos 10 caracteres');

    const asistencia = await AsistenciaModel.findById(asistenciaId);
    if (!asistencia) throw errorHttp(404, 'La asistencia no existe');
    if (String(asistencia.usuario) !== String(usuarioSesion._id)) {
        throw errorHttp(403, 'Solo puedes justificar tus propias inasistencias');
    }
    if (asistencia.tipoNovedad !== 'Inasistencia') {
        throw errorHttp(400, 'Solo se pueden justificar inasistencias');
    }
    if (await JustificacionModel.exists({ asistencia: asistencia._id })) {
        throw errorHttp(409, 'Esta inasistencia ya tiene una justificación');
    }

    const creada = await JustificacionModel.create({
        asistencia: asistencia._id,
        motivo: motivo.trim(),
        ...(archivo && {
            archivo: archivo.ruta,
            archivoNombre: archivo.nombre,
            archivoTamano: archivo.tamano,
        }),
    });
    return await buscarFormateada(creada._id);
};

// Revisión: solo Administrador o el Entrenador del nivel
const dbUpdateJustificacion = async (usuarioSesion, id, { estado, observaciones } = {}) => {
    if (!['Aprobada', 'Rechazada'].includes(estado)) {
        throw errorHttp(400, 'El estado debe ser Aprobada o Rechazada');
    }
    const justificacion = await JustificacionModel.findById(id).populate('asistencia');
    if (!justificacion) return null;
    if (!justificacion.asistencia) throw errorHttp(409, 'La asistencia de esta justificación ya no existe');

    await validarAccesoNivel(usuarioSesion, justificacion.asistencia.nivel);

    // Solo cambia si sigue Pendiente 
    const actualizada = await JustificacionModel.findOneAndUpdate(
        { _id: id, estado: 'Pendiente' },
        {
            estado,
            observaciones: observaciones?.trim() || null,
            revisor: usuarioSesion._id,
            fechaRevision: new Date(),
        },
        { new: true, runValidators: true }
    );
    if (!actualizada) throw errorHttp(409, 'Esta justificación ya fue revisada');

    if (estado === 'Aprobada') {
        await AsistenciaModel.updateOne({ _id: justificacion.asistencia._id }, { tipoNovedad: 'Justificado' });
    }
    return await buscarFormateada(id);
};

const dbDeleteJustificacion = async (id) => {
    const justificacion = await JustificacionModel.findById(id);
    if (!justificacion) return null;

    // Si estaba aprobada, la asistencia vuelve a ser inasistencia
    if (justificacion.estado === 'Aprobada') {
        await AsistenciaModel.updateOne({ _id: justificacion.asistencia }, { tipoNovedad: 'Inasistencia' });
    }
    await justificacion.deleteOne();
    return justificacion;
};

export {
    dbCreateJustificacion,
    dbGetJustificacion,
    dbDeleteJustificacion,
    dbUpdateJustificacion
}