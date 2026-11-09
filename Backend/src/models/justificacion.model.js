import { Schema, model } from "mongoose";

const justificacionSchema = new Schema(
  {
    estado: {
      type: String,
      enum: {
        values: ["Pendiente", "Aprobada", "Rechazada"],
        message: "El estado debe ser: Pendiente, Aprobada o Rechazada",
      },
      default: "Pendiente",
    },
    fecha: {
      type: Date,
      default: Date.now,
      required: [true, "La fecha es obligatoria"],
    },
    motivo: {
      type: String,
      required: [true, "El motivo es obligatorio"],
      trim: true,
      minlength: [10, "El motivo debe tener al menos 10 caracteres"],
      maxlength: [250, "El motivo no puede superar los 250 caracteres"],
    },
    archivo: { 
      type: String, 
      trim: true, 
      default: null 
    },          // ruta pública del soporte
    archivoNombre: { 
      type: String, 
      trim: true, 
      default: null 
    },      // nombre original del soporte
    archivoTamano: { 
      type: String, 
      trim: true, 
      default: null 
    },    // tamaño legible del soporte
    observaciones: {
      type: String,
      trim: true,
      maxlength: [250, "Las observaciones no pueden superar los 250 caracteres"],
      default: null,
    },
    fechaRevision: { 
      type: Date, 
      default: null 
    },
    // Una justificación por asistencia
    asistencia: {
      type: Schema.Types.ObjectId,
      ref: "asistencia",
      required: [true, "La asistencia es obligatoria"],
      unique: true,
    },
    // Quien revisa la justificación (entrenador/administrador). Requiere el modelo 'usuario'
    revisor: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const JustificacionModel = model("justificacion", justificacionSchema);

export default JustificacionModel;
