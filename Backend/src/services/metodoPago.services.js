import metodoPagoModel from "../models/metodoPago.model.js";

const dbGetMetodoPago = async () => {
    return await metodoPagoModel.find()
}

const dbCreateMetodoPago = async (newMetodoPago) => {
    return await metodoPagoModel.create(newMetodoPago)
}

const dbDeleteMetodoPago = async (id) => {
    return await metodoPagoModel.findOneAndDelete({ _id: id})
}

const dbUpdateMetodoPago = async (id, metodoPagoUpdate) => {
    return await metodoPagoModel.findOneAndUpdate(
        {_id: id},
        metodoPagoUpdate,
        {new : true}
    );
}

const dbGetMetodoPagos = async (id) => {
    return await metodoPagoModel.findOne({_id: id})
}



export {
    dbGetMetodoPago,
    dbCreateMetodoPago,
    dbDeleteMetodoPago,
    dbUpdateMetodoPago,
    dbGetMetodoPagos
}