import { dbCreateContactoE, dbGetContactoE, dbUpdateContactoE } from "../services/contactoEmergencia.services.js";

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

const esAdmin = (req) => req.userFound.rol === 'Administrador';

// Solo el dueño del contacto o un administrador
const esDuenoOAdmin = (req, contacto) => {
    if (esAdmin(req)) return true;
    const duenoId = contacto.createdBy?._id ?? contacto.createdBy;
    return String(duenoId) === String(req.userFound._id);
}

// Carga el contacto y valida existencia, estado y permisos
const cargarContacto = async (req, res) => {
    const contacto = await dbGetContactoE(req.params.id);

    // Un contacto inhabilitado solo lo ve el admin
    if (!contacto || (!contacto.status && !esAdmin(req))) {
        res.status(404).json({ msg: 'Contacto de emergencia no encontrado' });
        return null;
    }
    if (!esDuenoOAdmin(req, contacto)) {
        res.status(403).json({ msg: 'No tienes permiso sobre este contacto' });
        return null;
    }
    return contacto;
}

const getContactoEmergencia = async (req, res) => {
    try {
        const contacto = await cargarContacto(req, res);
        if (!contacto) return;

        res.json({ msg: 'Obtiene un contacto de emergencia', data: contacto });
    }
    catch (error) {
        responderError(res, error, 'No se puede obtener el contacto de emergencia por ID');
    }
}

const createContactoEmergencia = async (req, res) => {
    try {
        const inputData = req.body;

        // El contacto pertenece a quien lo registra y nace activo
        inputData.createdBy = req.userFound._id;
        delete inputData.status;

        if (inputData.parentesco === 'Otro' && !inputData.parentescoOtro?.trim()) {
            return res.status(400).json({ errors: { parentescoOtro: 'Escribe el parentesco' } });
        }

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
        const contacto = await cargarContacto(req, res);
        if (!contacto) return;

        const inputData = req.body;

        // Ni el dueño ni el estado se cambian
        delete inputData.createdBy;
        delete inputData.status;

        if (inputData.parentesco && inputData.parentesco !== 'Otro') {
            inputData.parentescoOtro = null;
        }

        if (inputData.parentesco === 'Otro' && !inputData.parentescoOtro?.trim()) {
            return res.status(400).json({ errors: { parentescoOtro: 'Escribe el parentesco' } });
        }

        const data = await dbUpdateContactoE(req.params.id, inputData);

        res.json({ msg: 'Contacto de emergencia actualizado', data: data });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido actualizar el contacto de emergencia');
    }
}

// Inhabilita o reactiva un contacto de emergencia
const cambiarEstadoContactoEmergencia = async (req, res) => {
    try {
        const { status } = req.body;

        if (typeof status !== 'boolean') {
            return res.status(400).json({ errors: { status: 'Debe ser true o false' } });
        }

        const contacto = await cargarContacto(req, res);
        if (!contacto) return;

        if (status === true && !esAdmin(req)) {
            return res.status(403).json({ msg: 'Solo un administrador puede reactivar un contacto' });
        }

        const data = await dbUpdateContactoE(req.params.id, { status });

        res.json({
            msg: status ? 'Contacto reactivado' : 'Contacto inhabilitado',
            data: data
        });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido cambiar el estado del contacto');
    }
}

export {
    createContactoEmergencia,
    getContactoEmergencia,
    updateContactoEmergencia,
    cambiarEstadoContactoEmergencia
}