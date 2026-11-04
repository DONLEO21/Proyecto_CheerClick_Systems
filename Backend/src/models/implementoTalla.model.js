import { Schema, model } from "mongoose";
import { GRUPOS_TALLA, tallaValidaParaGrupo } from "../constants/tallas.js";

const implementoTallaSchema = new Schema(
  {
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
    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Un implemento no puede repetir la misma talla dentro de un grupo
implementoTallaSchema.index({ implemento: 1, grupo: 1, talla: 1 }, { unique: true });

const ImplementoTallaModel = model("implementoTalla", implementoTallaSchema);

export default ImplementoTallaModel;