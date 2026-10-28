import NivelModel from "../models/nivel.model.js";

const dbCreateNivel = async (newNivel) => {
    return await NivelModel.create(newNivel);
}

const dbGetNivel = async () => {
    return await NivelModel.find().populate('nivel');
}

const dbUpdateNivel= async (id, nivelUpdate) => {
    return await NivelModel.findOneAndUpdate(
         { _id: id},
        nivelUpdate,
         {new: true}
        );
}

const dbDeleteNivel =  async (id) => {
    return await NivelModel.findOneAndDelete({ _id: id});
}

const dbGetNiveles = async (id) => {
    return await NivelModel.findOne({ _id: id});
}



// const dbNivel = async (query) => {
//     const avaiableStatus = ['Activo', 'Inactivo'];
//     let filter = {};

//     if ( query && avaiableStatus.includes(query.status)) {
//         filter.status = query.status
//     }

//     console.log({filter});
//     return {}
// }



export { 
    dbCreateNivel,
    dbGetNivel,
    dbDeleteNivel,
    dbUpdateNivel,
    dbGetNiveles
}