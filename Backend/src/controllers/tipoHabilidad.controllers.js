import { dbCreateTipoHabilidad, dbDeleteTipoHabilidad, dbGetTipoHabilidad, dbGetTipoHabilidades, dbUpdateTipoHabilidad } from "../services/tipoHabilidad.services.js";

const getTipoHabilidades = async (req, res) => {
    try {
        const data = await dbGetTipoHabilidades();

        return res.status(200).json({ msg: 'Consultar todos los tipos de habilidades registrados', data: data});
    } catch (error) {
        console.error(error);

        return res.status(500).json({ msg: 'No se pudo consultar los tipos de habilidades registradas' });
    }
};

const getTipoHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbGetTipoHabilidad(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el tipo de habilidad' });
        }

        return res.status(200).json({ msg: 'Consultar uno de los tipos de habilidad por su ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo consultar el tipo de habilidad' });
    }
};

const createTipoHabilidad = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateTipoHabilidad(inputData);

        return res.status(201).json({ msg: 'Registrar un tipo de habilidad', data: data });
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

        return res.status(500).json({ msg: 'Error al registrar el tipo de habilidad' });
    }
};

const updateTipoHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdateTipoHabilidad(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el tipo de habilidad a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos de un tipo de habilidad', data: data });
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

        return res.status(500).json({ msg: 'Error al actualizar los campos de un tipo de habilidad' });
    }
};

const deleteTipoHabilidad = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeleteTipoHabilidad(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el tipo de habilidad a eliminar' });
        }

        return res.status(200).json({ msg: 'Eliminar un tipo de habilidad', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar el tipo de habilidad' });
    }
};

export {
    getTipoHabilidad,
    getTipoHabilidades,
    createTipoHabilidad,
    deleteTipoHabilidad,
    updateTipoHabilidad
};