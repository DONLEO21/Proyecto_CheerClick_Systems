import { Schema, model } from "mongoose";

const CompetenciaSchema = new Schema ({
    nombre: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  fechaCompetencia: {
    type: Date,
    required: true
  },
  lugar: {
    type: String,
    maxlength: 100,
    trim: true
  },
 precioinscripcion: {
    type: Number,
    required: true,
    default: 0
  },
  fechalimite: {
    type: Date
  },
  Imagen: {
    type: String,
    trim: true
  },
  
  link: {
    type: String,
    maxlength: 100,
    trim: true
  },
  preciopublico: {
    type: Number,
    required: true,
    default: 0
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo'],
    default: 'Activo',
    required: true
  },
  nivel: {
      type: Schema.Types.ObjectId,
      ref: 'Nivel',          
      required: true
    },
  createBy: {
      type: Schema.Types.ObjectId,
      ref: 'usuario'         
    }
}, {
    timestamps: true,                
    versionKey: false 
});

const CompetenciaModel=model(
    'Competencia',
    CompetenciaSchema
);

export default CompetenciaModel