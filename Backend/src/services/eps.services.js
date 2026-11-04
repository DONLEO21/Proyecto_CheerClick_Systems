import EpsModel from "../models/eps.model.js"

const dbCreateEps = async (newEps) => {
    return await EpsModel.create(newEps); //Resgistra en la bd
}

const dbGetEps = async () => {
    return await EpsModel.find(); //Consultar todas las eps registradas
}

const dbDeleteEps = async (id) => {
    return await EpsModel.findOneAndDelete({ _id: id})
}

const dbUpdateEps = async (id, epsUpdate) => {
    return await EpsModel.findByIdAndUpdate (
   id,         //El id del documento qu deseamos actulizar
     epsUpdate,      //El objeto d los datos que deseamos actualizar
       {new : true}   //Configuracion para que retore el documento actualizado
    );

    return await EpsModel.findOneAndUpdate(
        {_id:id},
        categoryUpdated,
        {new: true}
    );
}

export { 
    dbCreateEps,
    dbGetEps,
    dbDeleteEps,
    dbUpdateEps
}