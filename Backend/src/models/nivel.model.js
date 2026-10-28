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
        type: String, // En MongoDB/Mongoose lo común es guardar la URL o ruta de la imagen en lugar de un BLOB binario
        required: false
    },
    estado: {
        type: String, // ¡Importante para que el enum funcione correctamente!
        enum: ['Activo', 'Inactivo'], // Ajusta los valores según los que uses en tu base de datos
        required: true,
        default: 'Activo'
    }
}, 
{
    timestamps: true,
    versionKey: false
});


const NivelModel= model('Nivel', NivelSchema);


export default NivelModel;

