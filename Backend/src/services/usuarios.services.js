// Servicio se habla con la db. Estas funciones
// realizaran la consultas a la db

import usuarioModel from "../models/usuarios.models.js"
import contadorModel from "../models/contador.model.js"

const PREFIJOS = { Atleta: 'AT', Entrenador: 'EN', Administrador: 'AD' };

// Genera el código del rol: AT001, EN001, AD001...
const dbGenerarCodigo = async ( rol ) => {
    const prefijo = PREFIJOS[rol];

    const contador = await contadorModel.findOneAndUpdate(
        { _id: prefijo },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return prefijo + String( contador.seq ).padStart( 3, '0' );
}

// Busca por correo sin filtrar por status: el login necesita distinguir las cuentas desactivadas
const dbFindUserByEmail = async ( email ) => {
    return await usuarioModel.findOne({ email: email });
}

//TODO: Conectar el modelo de usuarios con la base de datos
const dbCreateUsuario = async ( newUsuario ) => {
    return await usuarioModel.create(newUsuario);
}

const dbGetUsuario = async (id) => {
    return await usuarioModel.findOne({ _id : id}).select('-contrasena')
}

const dbGetUserForReset = async ( email ) => {
    return await usuarioModel
        .findOne({ email: email, status: true })
        .select('+resetCodeHash +resetCodeExpires +resetAttempts');
}

const dbUpdateUsuario = async (id, usuarioUpdate) => {
    return await usuarioModel.findByIdAndUpdate (
        id,
        usuarioUpdate,
        {new : true, runValidators : true}
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
    dbGetUserByEmail,
    dbGetUserForReset,
    dbGenerarCodigo,
    PREFIJOS,
    dbFindUserByEmail
}