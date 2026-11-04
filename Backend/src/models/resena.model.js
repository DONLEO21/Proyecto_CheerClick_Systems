import { Schema, model } from "mongoose";

const resenaSchema = new Schema(
  {
    estrella: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [0, "La calificación mínima es 0"],
      max: [5, "La calificación máxima es 5"],
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [300, "El comentario no puede superar los 300 caracteres"],
      default: null,
    },
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: "solicitud",
      required: [true, "La solicitud es obligatoria"],
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ResenaModel = model("resena", resenaSchema);

export default ResenaModel;