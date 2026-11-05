import CompetenciaModel from "../models/competencia.model.js";

// Crea una competencia (el controlador ya agrega createBy y el nivel elegido en el formulario)
const dbCreateCompetencia = async (newCompetencia) => {
    return await CompetenciaModel.create(newCompetencia);
}

// LISTA las competencias según el rol del usuario
// - Atleta: solo las ACTIVAS de su nivel
// - Administrador: todas las de todos los niveles 
const dbGetCompetencia = async (rol, nivel, nivelQuery) => {
    let filtro = {};

    if (rol === 'Atleta') {
        filtro = { nivel, estado: 'Activo' };
    } else if (nivelQuery) {
        filtro = { nivel: nivelQuery };
    }

    return await CompetenciaModel.find(filtro)
        .populate('nivel', 'nombre');    // Trae el nombre del nivel en lugar de solo el ID
}

// Actualiza una competencia por id
// CAMBIO: aquí también se inhabilita: PATCH con { "estado": "Inactivo" } (ya no existe DELETE)
const dbUpdateCompetencia = async (id, competenciaUpdate) => {
    return await CompetenciaModel.findOneAndUpdate(
        { _id: id },
        competenciaUpdate,
        { new: true, runValidators: true }
    );
}

// Obtiene UNA competencia por id
// No se hace populate de 'nivel' a propósito: el controlador compara data.nivel con el nivel del atleta
const dbGetCompetencias = async (id) => {
    return await CompetenciaModel.findOne({ _id: id });
}

export {
    dbGetCompetencia,
    dbCreateCompetencia,
    dbUpdateCompetencia,
    dbGetCompetencias
}