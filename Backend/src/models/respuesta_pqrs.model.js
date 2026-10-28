import {Schema, model} from "mongoose"

const Respuesta_pqrsSchema = new Schema ({
    pqrs: {
      type: Schema.Types.ObjectId,
      ref: "Pqrs",
      required: true
    },
    respuesta: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true
    },

    fechaCreacion: {
      type: Date,
      required: true,
      default: Date.now
    }
},
{
    timestamps: true,
    versionKey: false

})

const Respuesta_pqrsModel = model ('Respuesta_pqrs', Respuesta_pqrsSchema);

export default Respuesta_pqrsModel