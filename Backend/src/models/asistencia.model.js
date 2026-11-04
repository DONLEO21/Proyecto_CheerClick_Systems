import { Schema, model } from "mongoose";

const asistenciaSchema = new Schema(
  {
    tipoNovedad: {
      type: String,
      enum: {
        values: ["Presente", "Tarde", "Inasistencia", "Justificado"],
        message: "El tipo de novedad debe ser: Presente, Tarde, Inasistencia o Justificado",
      },
      required: [true, "El tipo de novedad es obligatorio"],
    },
    // Deportista al que se le registra la asistencia. Requiere el modelo 'usuario'
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
      required: [true, "El usuario es obligatorio"],
    },
    // Sesión de entrenamiento. Requiere el modelo 'horario'
    horario: {
      type: Schema.Types.ObjectId,
      ref: "horario",
      required: [true, "El horario es obligatorio"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Un usuario solo tiene una asistencia por horario
asistenciaSchema.index({ usuario: 1, horario: 1 }, { unique: true });

const AsistenciaModel = model("asistencia", asistenciaSchema);

export default AsistenciaModel;
