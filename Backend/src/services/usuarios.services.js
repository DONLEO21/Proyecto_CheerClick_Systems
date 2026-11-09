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

const dbUpdateUsuario = () => {}

const dbDeleteUsuario = () => {}

const dbGetUserByEmail = async ( email , status = true) => {
    return await usuarioModel.findOne({ email: email, status: status });
}

// Atletas activos (opcionalmente de un nivel). `nivel` puede ser un id o { $in: [...] }
const dbGetAtletas = async (nivel) => {
    const filtro = { rol: 'Atleta', status: true };
    if (nivel) filtro.nivel = nivel;
    return await usuarioModel.find(filtro).select('nombre apellido nivel').lean();
}

export {
    dbCreateUsuario,
    dbGetUsuario,
    dbUpdateUsuario,
    dbDeleteUsuario,
    dbGetUserByEmail,
    dbGetAtletas
}