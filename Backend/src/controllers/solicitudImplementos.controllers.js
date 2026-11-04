import { dbCreateSolicitudImplementos, dbDeleteSolicitudImplementos, dbGetSolicitudImplementos, dbUpdateSolicitudImplementos } from "../services/solicitudImplementos.services.js";

const createSolicitudImplementos = async (req, res) => {
    try {
        const inputData = req.body;

        //Usar el servicio para registrar
        const data = await dbCreateSolicitudImplementos(inputData);

        res.status(201).json({ msg: 'Registrar implemento de solicitud', data: data })
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

        res.status(500).json({ msg: 'No se pudo registrar el implemento de solicitud' })    //Retorna un error generico
    }
}

const getSolicitudImplementos = async (req, res) => {
    try {
        const data = await dbGetSolicitudImplementos();

        res.status(200).json({
            msg: 'Lista de implementos de solicitudes',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se ha podido listar implementos de solicitudes'
        })
    }
}

const updateSolicitudImplementos = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateSolicitudImplementos(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el implemento de solicitud' });
        }

        res.status(200).json({
            msg: 'Actualizar implemento de solicitud',
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
            msg: 'No se ha podido actualizar el implemento de solicitud'
        })
    }
}

const deleteSolicitudImplementos = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteSolicitudImplementos(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el implemento de solicitud' });
        }

        res.status(200).json({
            msg: 'Eliminar implemento de solicitud',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        res.status(500).json({
            msg: 'No se ha podido eliminar el implemento de solicitud'
        })
    }
}

export {
    createSolicitudImplementos,
    getSolicitudImplementos,
    updateSolicitudImplementos,
    deleteSolicitudImplementos
}