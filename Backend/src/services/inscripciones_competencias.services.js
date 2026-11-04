import Inscripciones_competenciasModel from "../models/inscripcion_competencia.model.js";

// Crea una inscripción (el controlador ya puso usuario desde el token y validó la competencia)
const dbCreateInscripcion_competencia = async (newInscripcion_competencia) => {
    return await Inscripciones_competenciasModel.create(newInscripcion_competencia);
}

// Verifica si el usuario ya está inscrito en esa competencia (evita duplicados)
const dbFindInscripcionDuplicada = async (competencia, usuario) => {
    return await Inscripciones_competenciasModel.findOne({ competencia, usuario });
}

// LISTA las inscripciones según el rol
// - Atleta: solo las suyas
// - Administrador: todas
const dbGetInscripcion_competencia = async (rol, usuarioId) => {
    const filtro = rol === 'Atleta' ? { usuario: usuarioId } : {};

    return await Inscripciones_competenciasModel.find(filtro)
        .populate({
            path: 'competencia',
            select: 'nombre fechaCompetencia lugar nivel',
            populate: { path: 'nivel', select: 'nombre' }   // Nivel de cada competencia
        })
        // IMPORTANTE: se limitan los campos para NO exponer la contraseña (hash) del usuario
        .populate('usuario', 'nombre apellido email')
        .populate('pago');
}

// Actualiza una inscripción por id
const dbUpdateInscripcion_competencia = async (id, inscripcion_competenciaUpdate) => {
    return await Inscripciones_competenciasModel.findOneAndUpdate(
        { _id: id },
        inscripcion_competenciaUpdate,
        { new: true, runValidators: true }
    );
}

// Elimina una inscripción por id
// filtroExtra permite limitar el borrado al dueño: el Atleta solo borra las suyas ({ usuario: _id })
const dbDeleteInscripcion_competencia = async (id, filtroExtra = {}) => {
    return await Inscripciones_competenciasModel.findOneAndDelete({ _id: id, ...filtroExtra });
}

// Obtiene UNA inscripción por id (con populate para poder validar el dueño en el controlador)
const dbGetInscripciones_competencias = async (id) => {
    return await Inscripciones_competenciasModel.findOne({ _id: id })
        .populate('competencia')
        .populate('usuario', 'nombre apellido email')   // Sin la contraseña
        .populate('pago');
}

export {
    dbCreateInscripcion_competencia,
    dbFindInscripcionDuplicada,
    dbGetInscripcion_competencia,
    dbUpdateInscripcion_competencia,
    dbDeleteInscripcion_competencia,
    dbGetInscripciones_competencias
}