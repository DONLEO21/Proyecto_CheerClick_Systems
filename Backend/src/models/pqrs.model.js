import {Schema, model} from "mongoose"

const PqrsSchema = new Schema({
    numero: {
      type: Number,
      required: true,
      unique: true
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'usuario',          
      required: true
    },

    asunto: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },

    descripcion: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true
    },

    fechaCreacion: {
      type: Date,
      required: true,
      default: Date.now
    },
    evidencia: {
      type: String,
      default: null,
      trim: true
    },

    tipo: {
      type: String,
      required: true,
      enum: [
        'Petición',
        'Queja',
        'Reclamo',
        'Sugerencia'
      ]
    },

    // CAMBIO: el trámite se llama "etapa" (el admin la cambia al responder)
    etapa: {
      type: String,
      required: true,
      enum: ['Pendiente', 'En tramite', 'Resuelta'],
      default: 'Pendiente'
    },

    prioridad: {
      type: String,
      required: true,
      enum: ['Baja', 'Media', 'Alta'],
      default: 'Media'
    },
    estado: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      required: true,
      default: 'Activo'
    }

},
{
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true }   
});

PqrsSchema.virtual('radicado').get(function () {
    return `PQ${String(this.numero).padStart(4, '0')}`;
});

const PqrsModel = model('Pqrs', PqrsSchema);

export default PqrsModel