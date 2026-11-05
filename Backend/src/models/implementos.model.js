import { Schema, model } from "mongoose";

const implementoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      unique: [true, "El nombre del implemento ya se encuentra registrado"],
    },
    genero: {
      type: String,
      enum: ["Femenino", "Masculino", "Unisex"],
      default: "Unisex",
    },
    categoria: {
      type: String,
      enum: ["Ropa", "Calzado", "Accesorios"],
      required: [true, "La categoría es obligatoria"],
    },
    estado: {
      type: String,
      enum: ["Disponible", "No Disponible"],
      default: "Disponible",
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    imagen: {
      type: String, 
      required: [true, "La imagen es obligatoria"],
      trim: true
    },
    createdBy: {
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

const ImplementoModel = model("implemento", implementoSchema);

export default ImplementoModel;