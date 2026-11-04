import { dbCreateMensualidad, dbDeleteMensualidad, dbGetMensualidad, dbGetMensualidades, dbUpdateMensualidad } from "../services/mensualidades.services.js";

const CreateMensualidad = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateMensualidad(inputData);

        return res.status(201).json({ msg: 'Registrar una nueva mensualidad', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'ValidationError') {
            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors });
        }

        return res.status(500).json({ msg: 'Error al registrar una mensualidad' });
    }
};

const GetMensualidad = async (req, res) => {
    try {
        const data = await dbGetMensualidad();

        return res.status(200).json({ msg: 'Consultar todas las mensualidades', data: data });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ msg: 'No se pudo consultar las mensualidades' });
    }
};

const DeleteMensualidad = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeleteMensualidad(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la mensualidad a eliminar' });
        }

        return res.status(200).json({ msg: 'Elimina una de las mensualidades', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar la mensualidad' });
    }
};

const UpdateMensualidad = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdateMensualidad(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la mensualidad a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos de la mensualidad', data: data });
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

        return res.status(500).json({ msg: 'No se pudo actualizar los campos de la mensualidad' });
    }
};

const GetMensualidades = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbGetMensualidades(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la mensualidad' });
        }

        return res.status(200).json({ msg: 'Consultar una de las mensualidades por su ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo encontrar la mensualidad' });
    }
};

export {
    CreateMensualidad,
    GetMensualidad,
    DeleteMensualidad,
    UpdateMensualidad,
    GetMensualidades
};