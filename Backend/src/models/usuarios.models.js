import { Schema, model } from "mongoose";

// Parte 1: Definir la estructura de datos de mi Documento
const usuarioSchema = new Schema({

    nombre: {
        type: String,             //Tipo de dato
        required: [true, 'El nombre es obligatorio'],           //Regla: Es Obligatorio
        trim: true
    },
    apellido: {
        type: String,           
        required: [true, 'El apellido es obligatorio'],          
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        trim: true
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
        trim: true
    },
    rol: {
        type: String,
        enum: ['Administrador', 'Atleta', 'Entrenador'],
        default: 'Atleta'
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'usuario',
        required: false
    },
    status : {
        type: Boolean,
        default: true,
        required: true
    },
    // Recuperación de contraseña. 
    resetCodeHash: {
        type: String,
        select: false
    },
    resetCodeExpires: {
        type: Date,
        select: false
    },
    resetAttempts: {
        type: Number,
        default: 0,
        select: false
    }
}, 
//Opciones del esquema
{
    timestamps: true
});

// Parte 2: Definir el modelo. Dicho modelo esta atado al nombre de documento
const usuarioModel = model(
    'usuario',    //nombre de la coleccion (pluraliza automaticamente)
    usuarioSchema);     //nombre del esquema que define la estructura de los datos

export default usuarioModel;