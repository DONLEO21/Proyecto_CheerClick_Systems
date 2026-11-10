import { Schema, model} from "mongoose";

const perfilUsuarioSchema = new Schema ({

    tipoDocumento: {
        type: String,
        required: [true, 'El tipo de documento es obligatorio'],
        enum: ['Cédula de Ciudadanía','Tarjeta de Identidad','Cédula de Extranjeria','Registro Civil','Pasaporte'],
        default: 'Cédula de Ciudadanía'
    },
    numDocumento: {
        type: String,
        unique: true,
        required: [true, 'El número de documento es obligatorio'],
        trim: true,
        maxlength: 15
    },
    genero: {
        type: String,
        required: [true, 'El género es obligatorio'],
        enum: ['Femenino','Masculino','Otro']
    },
    generoOtro: {
        type: String,
        trim: true,
        maxlength: 30,
        default: null
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
        maxlength: 15
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    eps: {
        type: String,
        required: [true, 'La EPS es obligatoria'],
        enum: ['Compensar', 'Coomeva', 'Famisanar', 'Nueva EPS', 'Salud Total', 'Sanitas', 'SURA', 'Otra']
    },
    epsOtra: {
        type: String,
        trim: true,
        maxlength: 40,
        default: null
    },
    poliza:{
        type: String,
        default: null
    },
    fotoPerfil: {
        type: String,
        default: null
    },
    certificadoEps: {
        type: String,
        default: null
    },
    // Cuántas veces el USUARIO corrigió cada campo "de una sola vez"
    ediciones: {
        numDocumento:    { type: Number, default: 0 },
        genero:          { type: Number, default: 0 },
        fechaNacimiento: { type: Number, default: 0 }
    },
    perteneceA: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
},{
    timestamps: true
});

const perfilUsuarioModel = model( 'perfilUsuario', perfilUsuarioSchema );

export default perfilUsuarioModel;