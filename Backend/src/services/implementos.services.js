import ImplementoModel from "../models/implementos.model.js";

const dbCreateImplemento = async (newImplemento) => {
    return await ImplementoModel.create(newImplemento); 
}

const dbGetImplemento = async () => {
    return await ImplementoModel.find()//.populate('createdBy'); 
}

const dbDeleteImplemento = async (id) => {
    return await ImplementoModel.findOneAndDelete({ _id: id })
}

const dbUpdateImplemento = async (id, implementosUpdate) => {
    return await ImplementoModel.findByIdAndUpdate(
        id,                  
        implementosUpdate,   
        { new: true, runValidators: true }  
    );
}

export {
    dbCreateImplemento,
    dbGetImplemento,
    dbDeleteImplemento,
    dbUpdateImplemento
}