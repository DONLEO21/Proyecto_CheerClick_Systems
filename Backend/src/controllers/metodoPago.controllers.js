import { dbCreateMetodoPago, dbDeleteMetodoPago, dbGetMetodoPago, dbGetMetodoPagos, dbUpdateMetodoPago } from "../services/metodoPago.services.js";

const getMetodoPago = async (req, res) => {
    try {
        const data = await dbGetMetodoPago();

        return res.status(200).json({ msg: 'Consultar todos los metodos de pagos registrados', data: data });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ msg: 'No se pudo consultar los metodos de pagos registrados' });
    }
};

const createMetodoPago = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateMetodoPago(inputData);

        return res.status(201).json({ msg: 'Registrar un nuevo metodo de pago', data: data });
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

        return res.status(500).json({ msg: 'No se pudo registrar el nuevo metodo de pago' });
    }
};

const deleteMetodoPago = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeleteMetodoPago(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el metodo de pago a eliminar' });
        }

        return res.status(200).json({ msg: 'Eliminar uno de los metodos de pago registrados', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar el metodo de pago' });
    }
};

const updateMetodoPago = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdateMetodoPago(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el metodo de pago a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos de metodo de pago', data: data });
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

        return res.status(500).json({ msg: 'No se pudo actualizar los campos de metodo de pago' });
    }
};

const getMetodoPagos = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbGetMetodoPagos(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el metodo de pago' });
        }

        return res.status(200).json({ msg: 'Consultar uno de los metodos de pago por su ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo encontrar el metodo de pago' });
    }
};

export {
    getMetodoPago,
    createMetodoPago,
    getMetodoPagos,
    updateMetodoPago,
    deleteMetodoPago
};