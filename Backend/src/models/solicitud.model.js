import { Schema, model } from "mongoose";

const solicitudeSchema = new Schema(
  {
    fecha: {
      type: Date,
      default: Date.now,
      required: [true, "La fecha es obligatoria"],
    },
    condicion: {
      type: String,
      enum: ["Pendiente", "Aprobado", "Entregada", "Cancelada", "Rechazada"],
      default: "Pendiente",
    },
    pago: {
      type: Schema.Types.ObjectId,
      ref: "pagos",
      required: [true, "El pago es obligatorio"],
      unique: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
      required: [true, "El usuario es obligatorio"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SolicitudModel = model("solicitud", solicitudeSchema);

export default SolicitudModel;