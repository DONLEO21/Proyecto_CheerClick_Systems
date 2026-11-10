import { dbCreateContactoE, dbDeleteContactoE, dbGetContactoE, dbUpdateContactoE } from "../services/contactoEmergencia.services.js";

// Convierte los errores de Mongoose en respuestas con código HTTP
const responderError = (res, error, msg) => {
    console.error(error);

    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) {
            errors[field] = error.errors[field].message;
        }
        return res.status(400).json({ errors });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({ msg: 'El ID no tiene un formato válido' });
    }

    res.status(500).json({ msg });
}

// Solo el dueño del contacto o un administrador
const esDuenoOAdmin = (req, contacto) => {
    if (req.userFound.rol === 'Administrador') return true;
    const duenoId = contacto.createdBy?._id ?? contacto.createdBy;
    return String(duenoId) === String(req.userFound._id);
}

const getContactoEmergencia = async (req, res) => {
    try {
        const data = await dbGetContactoE(req.params.id);

        if (!data) {
            return res.status(404).json({ msg: 'Contacto de emergencia no encontrado' });
        }
        if (!esDuenoOAdmin(req, data)) {
            return res.status(403).json({ msg: 'No tienes permiso sobre este contacto' });
        }

        res.json({ msg: 'Obtiene un contacto de emergencia', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se puede obtener el contacto de emergencia por ID');
    }
}

const createContactoEmergencia = async (req, res) => {
    try {
        const inputData = req.body;

        // El contacto pertenece a quien lo registra
        inputData.createdBy = req.userFound._id;

        // Si el parentesco es "Otro", el texto es obligatorio
        if (inputData.parentesco === 'Otro' && !inputData.parentescoOtro?.trim()) {
            return res.status(400).json({ errors: { parentescoOtro: 'Escribe el parentesco' } });
        }

        // Si no es "Otro", se descarta el texto libre
        if (inputData.parentesco !== 'Otro') {
            inputData.parentescoOtro = null;
        }

        const data = await dbCreateContactoE(inputData);

        res.status(201).json({ msg: 'Registrar contacto de emergencia', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se pudo registrar contacto de emergencia');
    }
}

const updateContactoEmergencia = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const contacto = await dbGetContactoE(id);
        if (!contacto) {
            return res.status(404).json({ msg: 'Contacto de emergencia no encontrado' });
        }
        if (!esDuenoOAdmin(req, contacto)) {
            return res.status(403).json({ msg: 'No tienes permiso sobre este contacto' });
        }

        // Un contacto no se puede pasar a otro usuario
        delete inputData.createdBy;

        if (inputData.parentesco && inputData.parentesco !== 'Otro') {
            inputData.parentescoOtro = null;
        }

        if (inputData.parentesco === 'Otro' && !inputData.parentescoOtro?.trim()) {
            return res.status(400).json({ errors: { parentescoOtro: 'Escribe el parentesco' } });
        }

        const data = await dbUpdateContactoE(id, inputData);

        res.json({ msg: 'Contacto de emergencia actualizado', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido actualizar el contacto de emergencia');
    }
}

const deleteContactoEmergencia = async (req, res) => {
    try {
        const contacto = await dbGetContactoE(req.params.id);
        if (!contacto) {
            return res.status(404).json({ msg: 'Contacto de emergencia no encontrado' });
        }
        if (!esDuenoOAdmin(req, contacto)) {
            return res.status(403).json({ msg: 'No tienes permiso sobre este contacto' });
        }

        const data = await dbDeleteContactoE(req.params.id);

        res.json({ msg: 'Contacto de emergencia eliminado', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido eliminar el contacto de emergencia');
    }
}

export {
    createContactoEmergencia,
    updateContactoEmergencia,
    deleteContactoEmergencia,
    getContactoEmergencia
}