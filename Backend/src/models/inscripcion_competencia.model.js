import {Schema, model} from "mongoose"

const Inscripciones_competenciasSchema = new Schema ({
    competencia : {
        type: Schema.Types.ObjectId,
        ref: 'Competencia',
        required: true
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    pago: {
    type: Schema.Types.ObjectId,
    ref: 'Pagos',
    required: true
}
}, {
    timestamps: true,
    versionKey: false
});


const Inscripciones_competenciasModel = model('Inscripciones_competencias', Inscripciones_competenciasSchema);

export default Inscripciones_competenciasModel