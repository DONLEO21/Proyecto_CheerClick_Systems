import { dbCreateHabilidad, dbDeleteHabilidad, dbGetHabilidad, dbGetHabilidades, dbUpdateHabilidad } from "../services/habilidades.services.js";

const getHabilidades = async (req, res) => {
    try {
        const data = await dbGetHabilidades();

        return res.status(200).json({ msg: 'Consultar todas las habilidades registradas', data: data});
    } catch (error) {
        console.error(error);

        return res.status(500).json({ msg: 'No se pudo consultar las habilidades registradas' });
    }
};

const getHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbGetHabilidad(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la habilidad' });
        }

        return res.status(200).json({ msg: 'Consultar una de las habilidades por ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo consultar la habilidad registrada' });
    }
};

const createHabilidad = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateHabilidad(inputData);

        return res.status(201).json({ msg: 'Registrar habilidad', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'ValidationError') {
            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors });
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(409).json({
                [field]: `El '${field}' con el valor '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        return res.status(500).json({ msg: 'Error al registrar la habilidad' });
    }
};

const updateHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdateHabilidad(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la habilidad a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos de la habilidad', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'ValidationError') {
            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors });
        }

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(409).json({
                [field]: `El '${field}' con el valor '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        return res.status(500).json({ msg: 'Error al actualizar los campos de la habilidad' });
    }
};

const deleteHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeleteHabilidad(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la habilidad a eliminar' });
        }

        return res.status(200).json({ msg: 'Eliminar una habilidad', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar la habilidad' });
    }
};

export {
    getHabilidad,
    getHabilidades,
    updateHabilidad,
    deleteHabilidad,
    createHabilidad
};