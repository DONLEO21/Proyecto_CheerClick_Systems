import { Schema, model } from "mongoose";

// Un documento por prefijo: { _id: 'AT'}
const contadorSchema = new Schema({
    _id: { type: String },
    seq: { type: Number, default: 0 }
});

const contadorModel = model( 'contador', contadorSchema );

export default contadorModel;