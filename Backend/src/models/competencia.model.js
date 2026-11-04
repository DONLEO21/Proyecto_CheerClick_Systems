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
    // CAMBIO: 'Inhabilitado' pasa a 'Inactivo', igual que en niveles
    enum: ['Activo', 'Inactivo'],
    default: 'Activo',
    required: true
  },
  nivel: {
      type: Schema.Types.ObjectId,
      ref: 'Nivel',          // debe coincidir con el nombre de tu modelo de niveles
      required: true
    },
  createBy: {
      type: Schema.Types.ObjectId,
      ref: 'usuario'        
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