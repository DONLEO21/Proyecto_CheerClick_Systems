import CompetenciaModel from "../models/competencia.model.js";

const dbCreateCompetencia = async (newCompetencia) => {
    return await CompetenciaModel.create(newCompetencia);
}

// LISTA las competencias según el rol del usuario
// - Atleta: solo las ACTIVAS de su nivel
// - Administrador: todas las de todos los niveles (o las de un nivel si envía ?nivel=ID)
const dbGetCompetencia = async (rol, nivel, nivelQuery) => {
    let filtro = {};

    if (rol === 'Atleta') {
        filtro = { nivel, estado: 'Activo' };
    } else if (nivelQuery) {
        filtro = { nivel: nivelQuery };
    }

    return await CompetenciaModel.find(filtro)
        .select('-Imagen')               // No carga el binario de la imagen en el listado (lo hace más rápido)
        .populate('nivel', 'nombre');    // Trae el nombre del nivel en lugar de solo el ID
}

// Actualiza una competencia por id
// CAMBIO: aquí también se inhabilita: PATCH con { "estado": "Inactivo" } (ya no existe DELETE)
// runValidators: aplica las validaciones del modelo (enum, maxlength, etc.) también al actualizar
const dbUpdateCompetencia = async (id, competenciaUpdate) => {
    return await CompetenciaModel.findOneAndUpdate(
        { _id: id },
        competenciaUpdate,
        { new: true, runValidators: true }
    );
}

const dbGetCompetencias = async (id) => {
    return await CompetenciaModel.findOne({ _id: id });
}

export {
    dbGetCompetencia,
    dbCreateCompetencia,
    dbUpdateCompetencia,
    dbGetCompetencias
}