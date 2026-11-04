import { Schema, model} from "mongoose";

const perfilUsuarioSchema = new Schema ({

    tipoDocumento: {
        type: String,
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
        enum: ['Femenino','Masculino','Otro'],
        default: 'Otro'
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
    poliza:{
        type: String,
        default: null
    },
    fotoPerfil: {
        type: String,
        default: null
    },
    perteneceA: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        default: null
    },
    Id_eps: {
        type: Schema.Types.ObjectId,
        ref: 'eps',
        default: null
    }
},{
    timestamps: true
});

const perfilUsuarioModel = model( 'perfilUsuario', perfilUsuarioSchema );

export default perfilUsuarioModel;