import { Schema, model } from "mongoose";

const Plantilla_horarioSchema = new Schema(
    {
        dia: {
            type: String,
            enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            required: true
        },
        horaInicio: {
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "La hora de inicio debe tener formato HH:mm"]
        },
        horaFin: {
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "La hora fin debe tener formato HH:mm"],
            validate: {
                validator: function (valor) {
                    // Compara textos "HH:mm", funciona porque siempre tienen 2 dígitos
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
    {
        timestamps: true,
        versionKey: false
    });

const Plantilla_horarioModel = model('Plantilla_horario', Plantilla_horarioSchema);

export default Plantilla_horarioModel;
