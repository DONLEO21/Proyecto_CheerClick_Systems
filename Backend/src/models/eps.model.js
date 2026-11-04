import { Schema, model } from "mongoose";

//Definir la estructura coleccion
const EpsSchema = new Schema(
  //Definir la estructura de datos
  {
    nombre: {
      type: String,
      enum: ["Sanitas", "Famisanar", "Nueva EPS", "Capital Salud"],
      default: "Famisanar",
    },
  },
  //Configuraciones de la estructura  datos
  {
    timestamps: true, //Agrega los campos created, updateAtd automaticamente (lo acualiza automaticamente)
    versionKey: false,
  },
);

//Definir modelo a partir de la estructura del documento
const EpsModel = model(
  "eps", //Nombre de la coleccion donde se guardaran los documentos de tipo eps
  EpsSchema, //Schema (structura de datos) que se guardara en coleccion
);

//Exportar el modelo para que pueda ser usado por los servicios
export default EpsModel;
