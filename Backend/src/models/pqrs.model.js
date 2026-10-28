import {Schema, model} from "mongoose"

const PqrsSchema = new Schema({
    asunto: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
      unique: true
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
      type: Buffer,
      default: null,
      validate: {
        validator: function (archivo) {
          return !archivo || archivo.length <= 2 * 1024 * 1024;
        },
        message: 'La evidencia no puede superar los 2 MB.'
      }
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

    estado: {
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
    }

},
{
    timestamps: true,
    versionKey: false

});


const PqrsModel = model('Pqrs', PqrsSchema);

export default PqrsModel