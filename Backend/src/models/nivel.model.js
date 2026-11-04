import {Schema, model} from "mongoose";

const NivelSchema = new Schema({
    nombre : {
        type: String,
        required: [true, 'El nombre del nivel es obligatorio'],
        trim: true,
        unique: true
    },
    diasEntreno: {
        type: Number, // Equivalente a TINYINT en bases de datos relacionales
        required: [true, 'Los días de entrenamiento son obligatorios'],
        min: 0
    },
    imagenEntre: {
        type: String, 
        required: false
    },
    estado: {
        type: String, 
        enum: ['Activo', 'Inactivo'],
        required: true,
        default: 'Activo'
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});


const NivelModel= model('Nivel', NivelSchema);


export default NivelModel;

