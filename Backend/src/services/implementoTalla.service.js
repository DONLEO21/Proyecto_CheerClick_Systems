import ImplementoTallaModel from "../models/implementoTalla.model.js";
import ImplementoModel from "../models/implementos.model.js";
import { GRUPOS_POR_CATEGORIA } from "../constants/tallas.js";

const validarGrupoCategoria = async (implementoId, grupo) => {
    const implemento = await ImplementoModel.findById(implementoId);

    if (!implemento) {
        const err = new Error('Implemento no encontrado');
        err.name = 'ValidationError';
        err.errors = { implemento: { message: 'El implemento no existe' } };
        throw err;
    }

    const permitidos = GRUPOS_POR_CATEGORIA[implemento.categoria] ?? [];
    if (!permitidos.includes(grupo)) {
        const err = new Error('Grupo no permitido para la categoría');
        err.name = 'ValidationError';
        err.errors = {
            grupo: { message: `Para la categoría ${implemento.categoria} el grupo debe ser: ${permitidos.join(', ')}` }
        };
        throw err;
    }
}

const dbCreateImplementoTalla = async (newImplementoTalla) => {
    await validarGrupoCategoria(newImplementoTalla.implemento, newImplementoTalla.grupo);
    return await ImplementoTallaModel.create(newImplementoTalla);
}

const dbGetImplementoTalla = async () => {
    return await ImplementoTallaModel.find().populate('implemento');
}

const dbDeleteImplementoTalla = async (id) => {
    return await ImplementoTallaModel.findOneAndDelete({ _id: id })
}

const dbUpdateImplementoTalla = async (id, implementoTallaUpdate) => {
    return await ImplementoTallaModel.findByIdAndUpdate(
        id,
        implementoTallaUpdate,
        { new: true, runValidators: true }
    );
}

export {
    dbCreateImplementoTalla,
    dbGetImplementoTalla,
    dbDeleteImplementoTalla,
    dbUpdateImplementoTalla
}