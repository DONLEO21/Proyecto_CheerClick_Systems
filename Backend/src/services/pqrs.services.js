import PqrsModel from "../models/pqrs.model.js";

const dbCreatePqrs = async (newPqrs) => {
    return await PqrsModel.create(newPqrs);
}

const dbGetPqrs = async () => {
    return await PqrsModel.find();
}

const dbDeletePqrs = async (id) => {
    return await PqrsModel.findOneAndDelete({ _id: id});
}

const dbUpdatePqrs = async (id, PqrsUpdate) => {
    return await PqrsModel.findOneAndUpdate({ _id: id}, PqrsUpdate, {new: true});
}

const dbGetpqrs = async (id) => {
    return await PqrsModel.findOne({ _id: id});

}
export {
    dbCreatePqrs,
    dbGetPqrs,
    dbDeletePqrs,
    dbUpdatePqrs,
    dbGetpqrs
}