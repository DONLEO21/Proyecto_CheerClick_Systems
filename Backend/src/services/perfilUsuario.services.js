import perfilUsuarioModel from "../models/perfilUsuario.model.js";

const dbCreatePerfilUsuario = async (perfilUsuario) => {
    return await perfilUsuarioModel.create(perfilUsuario);
}

const dbGetPerfilUsuario = async (id) => {
    return await perfilUsuarioModel.findById(id);
}

const dbUpdatePerfilUsuario = async (id, perfilUsuarioUpdate) => {
    return await perfilUsuarioModel.findByIdAndUpdate(
        id,
        perfilUsuarioUpdate,
        { new: true, runValidators: true }
    );
}

const dbGetPerfilByUsuario = async (idUsuario) => {
    return await perfilUsuarioModel.findOne({ perteneceA: idUsuario });
}

export {
    dbCreatePerfilUsuario,
    dbGetPerfilUsuario,
    dbUpdatePerfilUsuario,
    dbGetPerfilByUsuario
}