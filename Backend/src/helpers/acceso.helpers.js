import usuarioModel from "../models/usuarios.models.js";
import { errorHttp } from "./errores.helpers.js";

// Niveles que dirige un entrenador.
// PENDIENTE AL UNIRLO
export const nivelesDelEntrenador = async (entrenadorId) => {
    if (!NivelModel.schema.path('entrenador')) {
        console.warn("Falta el campo 'entrenador' en el modelo Nivel: no se restringe por entrenador");
        return null;
    }
    const niveles = await NivelModel.find({ entrenador: entrenadorId }).select('_id').lean();
    return niveles.map((n) => n._id);
};

// Un entrenador solo puede tocar sus niveles. Administrador pasa siempre.
export const validarAccesoNivel = async (usuario, nivelId) => {
    if (usuario.rol !== 'Entrenador') return;
    const propios = await nivelesDelEntrenador(usuario._id);
    if (propios && !propios.some((id) => String(id) === String(nivelId))) {
        throw errorHttp(403, 'Este nivel no está asignado a tu usuario');
    }
};

// Atleta: solo él mismo. Entrenador: solo atletas de sus niveles.
export const validarAccesoAtleta = async (usuario, atletaId) => {
    if (usuario.rol === 'Atleta' && String(usuario._id) !== String(atletaId)) {
        throw errorHttp(403, 'Solo puedes consultar tu propia información');
    }
    if (usuario.rol === 'Entrenador') {
        const atleta = await usuarioModel.findById(atletaId).select('nivel').lean();
        if (!atleta) throw errorHttp(404, 'El atleta no existe');
        if (atleta.nivel) await validarAccesoNivel(usuario, atleta.nivel);
    }
};

// Filtro de asistencias que cada rol puede ver
export const filtroAsistenciaPorRol = async (usuario, nivelQuery) => {
    if (usuario.rol === 'Atleta') return { usuario: usuario._id };
    if (usuario.rol === 'Entrenador') {
        if (nivelQuery) {
            await validarAccesoNivel(usuario, nivelQuery);
            return {};
        }
        const propios = await nivelesDelEntrenador(usuario._id);
        return propios ? { nivel: { $in: propios } } : {};
    }
    return {};
};