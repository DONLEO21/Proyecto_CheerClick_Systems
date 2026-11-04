import { Schema, model} from "mongoose";

const contactoEmergenciaSchema =new Schema({
    parentesco: {
        type: String,
        enum: ['Madre', 'Padre', 'Tutor', 'Cónyuge', 'Otro'],
        default: 'Madre',     
    },
    nombre: {
        type: String,            
        required: [true, 'El nombre es obligatorio'],         
        trim: true
    },
    apellido: {
        type: String,           
        required: [true, 'El apellido es obligatorio'],          
        trim: true
    },
    telefono: {
        type: String,           
        required: [true, 'El telefono es obligatorio'],          
        trim: true
    },
    principal: {
        type: Boolean,
        default: false,
        required: [true, 'Es obligatorio']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        default: null
    }

},{
    timestamps: true
});

const contactoEModel = model( 'contactoemergencia', contactoEmergenciaSchema );

export default contactoEModel;