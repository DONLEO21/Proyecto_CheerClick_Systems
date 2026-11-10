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

const dbListUsuarios = async ( filtro, page = 1, limit = 10 ) => {
    const [ data, total ] = await Promise.all([
        usuarioModel.find( filtro ).select('-contrasena').sort({ createdAt: -1 }).skip( (page - 1) * limit ).limit( limit ),
        usuarioModel.countDocuments( filtro )
    ]);

    return { data, total };
}

const dbCountUsuarios = async ( filtro = {} ) => {
    return await usuarioModel.countDocuments( filtro );
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

const dbGetUserByEmail = async ( email , status = true) => {
    return await usuarioModel.findOne({ email: email, status: status });
}

export {
    dbCreateUsuario,
    dbGetUsuario,
    dbUpdateUsuario,
    dbGetUserByEmail,
    dbGetUserForReset,
    dbGenerarCodigo,
    PREFIJOS,
    dbFindUserByEmail,
    dbListUsuarios,
    dbCountUsuarios
}