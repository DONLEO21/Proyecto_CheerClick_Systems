import {Schema, model} from "mongoose";

const TipoHabilidadSchema = new Schema(
    {
    nombre : {
        type: String,
        required : [true, 'El nombre del tipo de habilidad es obligatorio'],   
        unique: true,
        trim: true   
    }
},
{
    timestamps: true,
    versionKey: false
});

const TipoHabilidadModel = model('TipoHabilidad', TipoHabilidadSchema);



export default TipoHabilidadModel;