import MensualidadModel from "../models/mensualidades.model.js"

const dbCreateMensualidad = async ( newMensualidad ) => {
    return await MensualidadModel.create( newMensualidad );    //Registrar en la base de datos
}

const dbGetMensualidad = async (filter = {}) => {
    return await MensualidadModel.find(filter)
        .populate('planAsociado')
        .populate('pago')
        .populate('usuario', 'nombre apellido email');
};

const dbDeleteMensualidad = async ( id ) => {
    return await MensualidadModel.findOneAndDelete({ _id: id}) 
}

const dbUpdateMensualidad = async ( id, mensualidadUpdate) => {
    return await MensualidadModel.findOneAndUpdate(
        { _id: id},
        mensualidadUpdate,
        {new: true}
    );
}

const dbGetMensualidades = async (id, filter = {}) => {
    return await MensualidadModel.findOne({_id: id, ...filter})
}

export{
    dbCreateMensualidad,
    dbGetMensualidad,
    dbDeleteMensualidad, 
    dbUpdateMensualidad,
    dbGetMensualidades
}