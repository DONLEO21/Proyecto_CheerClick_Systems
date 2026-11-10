import contactoEModel from "../models/contactoEmergencia.model.js";

const dbCreateContactoE = async ( newContactoE ) => {
    return await contactoEModel.create( newContactoE );

}

const dbGetContactoE = async (id) => {
    return await contactoEModel.findOne({ _id: id })
}

const dbUpdateContactoE = async (id, contactoEUpdate) => {
    return await contactoEModel.findByIdAndUpdate (
        id,
        contactoEUpdate,
        {
            new : true,
            runValidators: true
        }
    );
}

const dbGetContactosByUsuario = async (idUsuario, soloActivos = true) => {
    const filtro = { createdBy: idUsuario };
    if (soloActivos) filtro.status = true;
    return await contactoEModel.find(filtro).sort({ principal: -1 });
}

export {
    dbCreateContactoE,
    dbGetContactoE,
    dbUpdateContactoE,
    dbGetContactosByUsuario
}