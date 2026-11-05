import { dbCreateRespuesta_pqrs, dbDeleteRespuesta_pqrs, dbGetrespuesta_pqrs, dbGetRespuesta_pqrs, dbUpdateRespuesta_pqrs } from "../services/respuesta_pqrs.services.js";

const idInvalido = (res, id, error) => res.status(400).json({
    msg: `El ID debe tener 24 caracteres y el enviado tiene ${id?.length}`,
    [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
});

const erroresValidacion = (error) => {
    const errors = {};
    for (const field in error.errors) {
        errors[field] = error.errors[field].message;
    }
    return errors;
};

const createRespuesta_pqrs = async (req, res) => {
    try {
        const data = await dbCreateRespuesta_pqrs(req.body);
        res.status(201).json({ msg: 'Registra una Respuesta de pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.status) return res.status(error.status).json({ msg: error.message });

        if (error.name == 'CastError') return idInvalido(res, error.value, error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        if (error.name == 'ValidationError') {
            return res.status(400).json({ errors: erroresValidacion(error) });
        }

        res.status(500).json({ msg: 'No se pudo registrar una respuesta de pqrs' });
    }
}

const getRespuesta_pqrs = async (req, res) => {
    try {
        // CAMBIO: req.query (permite ?pqrs=ID) y el usuario para filtrar por rol
        const data = await dbGetRespuesta_pqrs(req.query, req.userFound);
        res.json({ msg: 'Consulta las Respuestas de pqrs', data: data });

    } catch (error) {
        console.error(error);
        if (error.name == 'CastError') return idInvalido(res, error.value, error);
        res.status(500).json({ msg: 'No se pudo consultar las Respuestas de pqrs' });
    }
}

const deleteRespuesta_pqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbDeleteRespuesta_pqrs(id);
        if (!data) return res.status(404).json({ msg: 'Respuesta de pqrs no encontrada' });

        res.json({ msg: 'Elimina una Respuesta de pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') return idInvalido(res, id, error);
        res.status(500).json({ msg: 'No se pudo eliminar la Respuesta de pqrs' });
    }
}

const updateRespuesta_pqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = { ...req.body };
        delete inputData.pqrs;

        const data = await dbUpdateRespuesta_pqrs(id, inputData);

        // CAMBIO: 404 si no existe
        if (!data) return res.status(404).json({ msg: 'Respuesta de pqrs no encontrada' });

        res.json({ msg: 'Actualiza una Respuesta de pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        if (error.name == 'CastError') return idInvalido(res, id, error);

        if (error.name == 'ValidationError') {
            // CAMBIO: se agregó return
            return res.status(400).json({ errors: erroresValidacion(error) });
        }

        res.status(500).json({ msg: 'No se pudo Actualizar la Respuesta de pqrs' });
    }
}

const getrespuesta_pqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetrespuesta_pqrs(id, req.userFound);
        if (!data) return res.status(404).json({ msg: 'Respuesta de pqrs no encontrada' });

        res.json({ msg: 'Obtiene una Respuesta de pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') return idInvalido(res, id, error);
        res.status(500).json({ msg: 'No se pudo obtener la Respuesta de pqrs' });
    }
}

export {
    createRespuesta_pqrs,
    getRespuesta_pqrs,
    deleteRespuesta_pqrs,
    updateRespuesta_pqrs,
    getrespuesta_pqrs
}