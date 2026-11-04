import { dbCreateRendimiento, dbDeleteRendimiento, dbGetRendimiento, dbUpdateRendimiento } from "../services/rendimiento.services.js";

const createRendimiento = async (req, res) => {
    try {
        const inputData = req.body;

        //Usar el servicio para registrar
        const data = await dbCreateRendimiento(inputData);

        res.status(201).json({ msg: 'Registrar rendimiento', data: data })
    }
    catch (error) {
        console.error(error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0]

            //Mensaje de error que se le envia al usuario
            return res.status(400).json({
                msg: `Error por duplicado en el campo '${field}'`,
                [field]: `El ${field} ${error.keyValue[field]} ya se encuentra registrado`
            });
        }

        if (error.name == 'ValidationError') {
            const errors = {};

            //Iterar los errores para extraer el nombre de la propiedad y el error
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ errors })     //Retorna un error especifico
        }

        res.status(500).json({ msg: 'No se pudo registrar el rendimiento' })    //Retorna un error generico
    }
}

const getRendimiento = async (req, res) => {
    try {
        const data = await dbGetRendimiento();

        res.status(200).json({
            msg: 'Lista de rendimientos',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se ha podido listar rendimientos'
        })
    }
}

const updateRendimiento = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateRendimiento(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el rendimiento' });
        }

        res.status(200).json({
            msg: 'Actualizar rendimiento',
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
            msg: 'No se ha podido actualizar el rendimiento'
        })
    }
}

const deleteRendimiento = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteRendimiento(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el rendimiento' });
        }

        res.status(200).json({
            msg: 'Eliminar rendimiento',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        res.status(500).json({
            msg: 'No se ha podido eliminar el rendimiento'
        })
    }
}

export {
    createRendimiento,
    getRendimiento,
    updateRendimiento,
    deleteRendimiento
}