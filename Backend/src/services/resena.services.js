import ResenaModel from "../models/resena.model.js";
import SolicitudModel from "../models/solicitud.model.js";
import SolicitudImplementosModel from "../models/solicitudImplementos.model.js";
import { errorHttp } from "../helpers/errores.helpers.js";

// Reseñas con nombre del atleta y de los implementos
const dbGetResena = async (filtro = {}) => {
    const resenas = await ResenaModel.find(filtro)
        .populate({ path: 'solicitud', select: 'usuario codigo', populate: { path: 'usuario', select: 'nombre apellido' } })
        .sort({ createdAt: -1 })
        .lean();

    const ids = resenas.map((r) => r.solicitud?._id).filter(Boolean);
    const lineas = await SolicitudImplementosModel.find({ solicitud: { $in: ids } })
        .populate('implemento', 'nombre')
        .lean();

    return resenas.map((r) => {
        const u = r.solicitud?.usuario;
        return {
            ...r,
            atleta: u ? `${u.nombre} ${u.apellido}` : null,
            implementos: lineas
                .filter((l) => String(l.solicitud) === String(r.solicitud?._id))
                .map((l) => l.implemento?.nombre)
                .filter(Boolean),
        };
    });
};

const dbCreateResena = async (usuarioId, { solicitud: solicitudId, estrella, comentario }) => {
    const solicitud = await SolicitudModel.findById(solicitudId);
    if (!solicitud) throw errorHttp(404, 'La solicitud no existe');
    if (String(solicitud.usuario) !== String(usuarioId))
        throw errorHttp(403, 'Solo puedes reseñar tus propias solicitudes');
    if (solicitud.condicion !== 'Entregado')
        throw errorHttp(400, 'Solo puedes reseñar pedidos que ya recibiste');

    return await ResenaModel.create({ solicitud: solicitud._id, estrella, comentario });
};

const dbUpdateResena = async (id, usuarioId, { estrella, comentario }) => {
    const resena = await ResenaModel.findById(id).populate('solicitud', 'usuario');
    if (!resena) return null;
    if (String(resena.solicitud.usuario) !== String(usuarioId))
        throw errorHttp(403, 'Solo puedes editar tus propias reseñas');

    if (estrella !== undefined) resena.estrella = estrella;
    if (comentario !== undefined) resena.comentario = comentario;
    return await resena.save();
};

const dbDeleteResena = async (id) => {
    return await ResenaModel.findOneAndDelete({ _id: id });
};

export {
    dbCreateResena,
    dbGetResena,
    dbDeleteResena,
    dbUpdateResena
};