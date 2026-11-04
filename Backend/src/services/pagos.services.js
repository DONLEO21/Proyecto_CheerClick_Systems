// Servicio se habla con la base de datos. Estas funciones realizaran las consultas a la base de datos 

import PagosModel from "../models/pagos.model.js"

// TODO: Conectar el modelo de pagos con la Base de datos 
const dbReadPagos = async () => {
    return await PagosModel.find().populate('metodoPago');
}

const dbInsertPago = async (newPago) => {
    return await PagosModel.create(newPago);
}

const dbUpdatePago = async (id, pagosUpdate) => {
    return await PagosModel.findOneAndUpdate(
        { _id: id},
        pagosUpdate,
        {new: true}
    );
}

const dbDeletePago = async (id) => {
    return await PagosModel.findOneAndDelete({ _id: id})
}

const dbgetPagos = async (id) => {
    return await PagosModel.findOne({_id: id})
}

export {
    dbReadPagos,
    dbInsertPago,
    dbUpdatePago,
    dbDeletePago,
    dbgetPagos
}