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
  
  // Manejo de BLOB (Se recomienda usar String para almacenar la URL/Ruta, pero puedes usar Buffer si necesitas binario puro)
  Imagen: {
    type: Buffer // O Buffer si prefieres binario, aunque 'String' (URL) es la práctica recomendada en MongoDB
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
    enum: ['Activo', 'Inhabilitado'],
    default: 'Activo',
    required: true
  }
}, {
    timestamps: true,                 // Agrega los campos CreateAt, updateAt automaticamente (los actualiza automaticamente)
    versionKey: false 
});

const CompetenciaModel=model(
    'Competencia',
    CompetenciaSchema
);

export default CompetenciaModel