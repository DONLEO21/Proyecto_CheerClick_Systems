// Servicio se habla con la db. Estas funciones
// realizaran la consultas a la db

import usuarioModel from "../models/usuarios.models.js"

//TODO: Conectar el modelo de usuarios con la base de datos
const dbCreateUsuario = async ( newUsuario ) => {
    return await usuarioModel.create(newUsuario);
}

const dbGetUsuario = async (id) => {
    return await usuarioModel.findOne({ _id : id})
}

const dbUpdateUsuario = async (id, usuarioUpdate) => {
    return await usuarioModel.findByIdAndUpdate (
        id,
        usuarioUpdate,
        {new : true}
    );
}

const dbDeleteUsuario = async (id) => {
    return await usuarioModel.findOneAndDelete({_id: id})
}

const dbGetUserByEmail = async ( email , status = true) => {
    return await usuarioModel.findOne({ email: email, status: status });
}

export {
    dbCreateUsuario,
    dbGetUsuario,
    dbUpdateUsuario,
    dbDeleteUsuario,
    dbGetUserByEmail
}