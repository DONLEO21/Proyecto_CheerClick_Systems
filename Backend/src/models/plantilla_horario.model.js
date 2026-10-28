import {Schema, model} from "mongoose";

// Definir la estructura de mi documento
const Plantilla_horarioSchema = new Schema(
    // Definir la estructura de datos
    {
        dia :{
            type: String,
            enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            required: true
        },
        horaInicio: {
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "La hora de inicio es obligaorio"]
        },
        horaFin : {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
            validate: {
                validator: function(valor){
                     return valor > this.horaInicio;
                },
                message: 'La hora fin debe ser posterior a la hora inicio'
            }
        },
         nivel: {
            type: Schema.Types.ObjectId,
            ref: 'Nivel',
            required: [true, "El id del nivel es obligatorio"]
        }
    },
    //Configuraciones de la estructura de datos 
    {
        timestamps: true,                 // Agrega los campos CreateAt, updateAt automaticamente (los actualiza automaticamente)
        versionKey: false                // Elimina la propiedad de versionamiento __v del Schema
    } );


// Definir el modelo a partir de la estructura del documento
const Plantilla_horarioModel = model(
    'Plantilla_horario'            // Nombre de la collection donde se guardan los documentos de tipo plantilla_horario
    , Plantilla_horarioSchema);    // Schema (estructura de datos) que se guardara en coleccion

// Exportamos el modelo para que pueda ser usado por los servicios    
export default Plantilla_horarioModel