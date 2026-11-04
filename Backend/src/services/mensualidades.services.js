import MensualidadModel from "../models/mensualidades.model.js"

const dbCreateMensualidad = async ( newMensualidad ) => {
    return await MensualidadModel.create( newMensualidad );    //Registrar en la base de datos
}

const dbGetMensualidad = async () => {
    return await MensualidadModel.find().populate('planAsociado', 'Pagos');  //Consultar todas las mensualidades registradas 
} 

const dbDeleteMensualidad = async ( id ) => {
    // return await MensualidadModel.findByIdAndDelete( id )
    return await MensualidadModel.findOneAndDelete({ _id: id}) 
}

const dbUpdateMensualidad = async ( id, mensualidadUpdate) => {
    // return await MensualidadModel.findByIdAndUpdate( 
    //     id, //El ID que se desea actualizar
    //     mensualidadUpdate,  //El objeto con los datos del documento que se desea actualizar
    //     {new : true}
    // );

    return await MensualidadModel.findOneAndUpdate(
        { _id: id},
        mensualidadUpdate,
        {new: true}
    );
}

const dbGetMensualidades = async (id) => {
    // return await MensualidadModel.findById(id)

    return await MensualidadModel.findOne({_id: id})
}

export{
    dbCreateMensualidad,
    dbGetMensualidad,
    dbDeleteMensualidad,
    dbUpdateMensualidad,
    dbGetMensualidades
}