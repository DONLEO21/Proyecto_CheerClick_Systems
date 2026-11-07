// Servicio se habla con la base de datos. Estas funciones realizaran las consultas a la base de datos 

import PagosModel from "../models/pagos.model.js"

// TODO: Conectar el modelo de pagos con la Base de datos 
const dbReadPagos = async (filter = {}) => {
    return await PagosModel.find(filter)
        .populate('metodoPago')
        .populate('usuario', 'nombre apellido email');
};

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

const dbgetPagos = async (id, filter = {}) => {
    return await PagosModel.findOne({_id: id, ...filter})
}

export {
    dbReadPagos,
    dbInsertPago,
    dbUpdatePago,
    dbgetPagos
}