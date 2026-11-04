import { dbCreateSolicitud, dbDeleteSolicitud, dbGetSolicitud, dbUpdateSolicitud } from "../services/solicitud.services.js";

const createSolicitud = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateSolicitud(inputData);

        res.status(201).json({ msg: 'Registrar solicitud', data: data })
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

        res.status(500).json({ msg: 'No se pudo registrar la solicitud' })    //Retorna un error generico
    }
}

const getSolicitud = async (req, res) => {
    try {
        const data = await dbGetSolicitud();

        res.status(200).json({
            msg: 'Lista de solicitudes',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se ha podido listar solicitudes'
        })
    }
}

const updateSolicitud = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateSolicitud(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la solicitud' });
        }

        res.status(200).json({
            msg: 'Actualizar solicitud',
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
            msg: 'No se ha podido actualizar la solicitud'
        })
    }
}

const deleteSolicitud = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteSolicitud(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró la solicitud' });
        }

        res.status(200).json({
            msg: 'Eliminar solicitud',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        res.status(500).json({
            msg: 'No se ha podido eliminar la solicitud'
        })
    }
}

export {
    createSolicitud,
    getSolicitud,
    updateSolicitud,
    deleteSolicitud
}