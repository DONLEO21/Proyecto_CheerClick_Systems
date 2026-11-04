import {Schema, model} from "mongoose";

//Parte 1: Definir la estructura de datos de mi documento

const PagosSchema = new Schema(
    //Definicion de los campos de documento
    {
    estado : {
        type: String,
        enum: ['Pagado', 'Vencido', 'Pendiente'],    //Tipo de dato
        required : [true, 'El estado del pago es obligatorio'],    //Regla: Es OBLIGATORIO
        trim: true   //Modificador : 
    },
    valorTotal : {
        type: Number,
        required : [true, 'El valor del pago es obligatorio'],
        trim : true 
    },
    fechaGenera : {
        type: Date,
        required : [true, 'El la fecha de generacion del pago es obligatoria']
    },
    fechaPago : {
        type: Date
    },
    comprobante:{
        type: String,
        required : [true, 'La ruta del comprobante es obligatoria'],
        trim:true
    },
    observaciones: {
        type : String,
        trim: true,
        maxlength: [100, 'Se supero la cantidad de caracteres para las observaciones']
    },
    metodoPago : {
        type: Schema.Types.ObjectId,
        ref : 'metodoPago',
        required: [true, 'El ID del pago es obligatorio']
    }
},
//
{
    timestamps: true
});

//Parte 2: Definir el modelo. Dicho modelo esta atado al nombre de un documento

const PagosModel = model('Pagos', PagosSchema);//Nombre de la coleccion  - Nombre del esquema que define la estructura de los documentos 



export default PagosModel;