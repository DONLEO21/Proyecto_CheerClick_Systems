import { TALLAS_POR_GRUPO } from "../constants/tallas.js";
import { dbCreateImplementoTalla, dbDeleteImplementoTalla, dbGetImplementoTalla, dbUpdateImplementoTalla } from "../services/implementoTalla.service.js";

const createImplementoTalla = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateImplementoTalla(inputData);

        res.status(201).json({ msg: 'Registrar talla de implemento', data: data })
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

        res.status(500).json({ msg: 'No se pudo registrar la talla de implemento' })    //Retorna un error generico
    }
}

const getImplementoTalla = async (req, res) => {
    try {
        const data = await dbGetImplementoTalla();

        res.status(200).json({
            msg: 'Lista de tallas de implementos',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se ha podido listar tallas de implementos'
        })
    }
}

const updateImplementoTalla = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateImplementoTalla(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la talla de implemento' });
        }

        res.status(200).json({
            msg: 'Actualizar talla de implemento',
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
            msg: 'No se ha podido actualizar la talla de implemento'
        })
    }
}

const deleteImplementoTalla = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteImplementoTalla(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la talla de implemento' });
        }

        res.status(200).json({
            msg: 'Eliminar talla de implemento',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        res.status(500).json({
            msg: 'No se ha podido eliminar la talla de implemento'
        })
    }
}

// Opciones de tallas disponibles por grupo (para llenar los selects del frontend)
const getOpcionesTalla = async (req, res) => {
    res.status(200).json({
        msg: 'Opciones de tallas por grupo',
        data: TALLAS_POR_GRUPO
    });
}

export {
    getOpcionesTalla,
    createImplementoTalla,
    getImplementoTalla,
    updateImplementoTalla,
    deleteImplementoTalla
}