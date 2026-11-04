import contactoEModel from "../models/contactoEmergencia.model.js";

const dbCreateContactoE = async ( newContactoE ) => {
    return await contactoEModel.create( newContactoE );

}

const dbGetContactoE = async (id) => {
    return await contactoEModel.findOne({ _id: id })
}

const dbDeleteContactoE = async (id) => {
    return await contactoEModel.findOneAndDelete({ _id: id})
}

const dbUpdateContactoE = async (id, contactoEUpdate) => {
    return await contactoEModel.findByIdAndUpdate (
        id,
        contactoEUpdate,
        {new : true}
    );
}

export {
    dbCreateContactoE,
    dbGetContactoE,
    dbDeleteContactoE,
    dbUpdateContactoE
}