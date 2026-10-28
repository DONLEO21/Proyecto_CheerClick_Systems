import {Schema, model} from "mongoose";

//Definir la estructura de mi documento
const MensualidadSchema = new Schema(
    //Definir la estrcutura de datos
    { 
        fechaGeneracion: {
            type: Date,
            required: [true, 'La fecha de generacion de la mensualidad es obligatoria']
        },
        fechaVencimiento: {
            type: Date,
            required: [true, 'La fecha de vencimiento de la mensualidad es obligatoria']
        },
        valor: {
            type: Number,
            required: [true, 'El valor de la mensualidad es obligatorio'],
            trim: true
        },
        numReferencia:{
            type: String,
            required: [true, 'El numero de referencia de la mensualidad es obligatorio'],
            trim: true,
            minlenght: [5, 'El numero de referencia debe ser mayor a 5 caracteres']
        },
        planAsociado: {
            type:Schema.Types.ObjectId,
            ref: 'planAsociado',
            required:[true, 'El ID del plan asociado es obligatorio']
        },
        pago: {
            type:Schema.Types.ObjectId,
            ref: 'Pagos',
            required: [true, 'El ID de pagos es obligatorio']
        }
        },
  //Configuraciones de la estructura de datos 
{
    timestamps : true,
    versionKey:  false //Elimina la propiedad de versionamiento del Schema 

});
//Definir el model a partir de la estructura del documento

const MensualidadModel = model('mensualidades', //Nombre de la coleccion donde se guardaran los documentos de las mensualidades
    MensualidadSchema
); //Schema que se guardara de la coleccion 

//Exportamos el modelo para que pueda ser usuado por los servicios 
export default MensualidadModel;