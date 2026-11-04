import { Schema, model } from "mongoose";
import { GRUPOS_TALLA, tallaValidaParaGrupo } from "../constants/tallas.js";

const solicitudImplementosSchema = new Schema(
  {
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: "solicitud",
      required: [true, "La solicitud es obligatoria"],
    },
    implemento: {
      type: Schema.Types.ObjectId,
      ref: "implemento",
      required: [true, "El implemento es obligatorio"],
    },
    grupo: {
      type: String,
      enum: {
        values: GRUPOS_TALLA,
        message: `El grupo debe ser uno de: ${GRUPOS_TALLA.join(", ")}`,
      },
      required: [true, "El grupo de talla es obligatorio"],
    },
    talla: {
      type: String,
      required: [true, "La talla es obligatoria"],
      trim: true,
      validate: {
        validator: tallaValidaParaGrupo,
        message: "La talla {VALUE} no corresponde al grupo seleccionado",
      },
    },
    cantidad: {
      type: Number,
      default: 1,
      min: [1, "La cantidad debe ser mayor a 0"],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad debe ser un número entero",
      },
    },
    precioUnitario: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: [0, "El precio unitario no puede ser negativo"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

solicitudImplementosSchema.index(
  { solicitud: 1, implemento: 1, grupo: 1, talla: 1 },
  { unique: true },
);

const SolicitudImplementosModel = model(
  "solicitudImplementos",
  solicitudImplementosSchema,
);

export default SolicitudImplementosModel;