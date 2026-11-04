import { Schema, model } from "mongoose";

const HorarioSchema = new Schema({
    fecha: {
        type: Date,
        required: [true, "La fecha del horario es obligatoria"]
    },
    enfoque: {
        type: String,
        required: [true, "El enfoque es obligatorio"],
        trim: true,
        maxlength: [100, 'El enfoque debe tener máximo 100 caracteres']
    },
    lugar: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'El lugar debe tener máximo 100 caracteres']
    },
    notasIndicaciones: {
        type: String,
        required: false,
        trim: true,
        maxlength: [250, "Las notas deben tener máximo 250 caracteres"]
    },
    estado: {
        type: String,
        enum: ['Activa', 'Cancelada', 'Suspendida'],
        required: true,
        default: 'Activa'
    },
    tipo: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        trim: true,
        maxlength: [50, 'El tipo debe tener máximo 50 caracteres']
    },
    franjaInicio: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, "La hora de inicio debe tener formato HH:mm"]
    },
    franjaFin: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, "La hora fin debe tener formato HH:mm"],
        validate: {
            // CAMBIO: validador simplificado, ahora funciona porque el update usa save()
            validator: function (valorFin) {
                const toMinutes = (t) => {
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                };
                return toMinutes(valorFin) > toMinutes(this.franjaInicio);
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

const HorarioModel = model('Horario', HorarioSchema);

export default HorarioModel;
