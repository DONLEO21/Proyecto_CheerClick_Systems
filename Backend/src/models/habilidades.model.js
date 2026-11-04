import {Schema, model} from "mongoose";

const HabilidadesSchema = new Schema(
    {
    nombre : {
        type: String, 
        required : [true, 'El nombre de la habilidad es obligatorio'], 
        unique: true,  
        trim: true   
    },
    estado : {
        type: String,
        enum: ['Activo', 'Inactivo'],
        required : [true, 'El estado de la habilidad es obligatorio'],
        trim : true 
    },
    tipoHabilidad : {
        type: Schema.Types.ObjectId,
        ref: 'TipoHabilidad',
        required: [true, 'El ID de tipo de habilidad es obligatorio']
    }
},
{
    timestamps: true,
    versionKey: false
});

const HabilidadesModel = model('Habilidad', HabilidadesSchema);

export default HabilidadesModel;