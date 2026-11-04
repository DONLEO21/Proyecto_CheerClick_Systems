import { dbCreateResena, dbDeleteResena, dbGetResena, dbUpdateResena } from "../services/resena.services.js";

const createResena = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateResena(inputData);

        res.status(201).json({ msg: 'Registrar reseña', data: data })
    }
    catch (error) {
        console.error(error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0]

            return res.status(400).json({
                msg: `Error por duplicado en el campo '${field}'`,
                [field]: `El ${field} ${error.keyValue[field]} ya se encuentra registrado`
            });
        }

        if (error.name == 'ValidationError') {
            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors })     //Retorna un error especifico
        }

        res.status(500).json({ msg: 'No se pudo registrar la reseña' })    //Retorna un error generico
    }
}

const getResena = async (req, res) => {
    try {
        const data = await dbGetResena();

        res.status(200).json({
            msg: 'Lista de reseñas',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se ha podido listar reseñas'
        })
    }
}

const updateResena = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateResena(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la reseña' });
        }

        res.status(200).json({
            msg: 'Actualizar reseña',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0]

            return res.status(400).json({
                msg: `Error por duplicado en el campo '${field}'`,
                [field]: `El ${field} ${error.keyValue[field]} ya se encuentra registrado`
            });
        }

        if (error.name == 'ValidationError') {
            const errors = {};

            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors })
        }

        res.status(500).json({
            msg: 'No se ha podido actualizar la reseña'
        })
    }
}

const deleteResena = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteResena(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la reseña' });
        }

        res.status(200).json({
            msg: 'Eliminar reseña',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        res.status(500).json({
            msg: 'No se ha podido eliminar la reseña'
        })
    }
}

export {
    createResena,
    getResena,
    updateResena,
    deleteResena
}