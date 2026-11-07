import { dbDeletePago, dbgetPagos, dbInsertPago, dbReadPagos, dbUpdatePago } from "../services/pagos.services.js";

const getFiltroPorRol = (user) => {
    switch (user.rol) {
        case 'Administrador':
            return {};         
        case 'Atleta':
            return { usuario: user._id };  
        default:
            return null;                 
    }
};

const getPagos = async (req, res) => {
    try {
        const filter = getFiltroPorRol(req.userFound);

        if (filter === null) {
            return res.status(403).json({ msg: 'No tienes permisos para consultar los pagos' });
        }

        let data = await dbReadPagos(filter);

        const { buscar, estado, mes } = req.query;

        if (buscar) {
            const texto = buscar.toLowerCase();
            data = data.filter(p =>
                `${p.usuario?.nombre} ${p.usuario?.apellido}`.toLowerCase().includes(texto)
            );
        }
        if (estado) data = data.filter(p => p.estado === estado);
        if (mes)    data = data.filter(p => p.fechaGenera.getUTCMonth() + 1 === Number(mes));

        return res.status(200).json({ msg: 'Consultar los pagos registrados', data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'No se pudo consultar los pagos registrados' });
    }
};

const getPago = async (req, res) => {
    const id = req.params.id;

    try {
        const filter = getFiltroPorRol(req.userFound);

        if (filter === null) {
            return res.status(403).json({ msg: 'No tienes permisos para consultar los pagos' });
        }

        const data = await dbgetPagos(id, filter);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el pago' });
        }

        return res.status(200).json({ msg: 'Consultar uno de los pagos por ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo consultar el pago por su ID' });
    }
};

const createPago = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbInsertPago(inputData);

        return res.status(201).json({ msg: 'Registrar Pagos', data: data });
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

        return res.status(500).json({ msg: 'Error al registrar pago' });
    }
};

const updatePagoPatch = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdatePago(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el pago a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos del pago', data: data });
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

        return res.status(500).json({ msg: 'Error al actualizar los campos de pago' });
    }
};

const deletePago = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeletePago(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el pago a eliminar' });
        }

        return res.status(200).json({ msg: 'Eliminar un pago', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar el pago' });
    }
};

export {
    getPagos,
    createPago,
    updatePagoPatch,
    deletePago,
    getPago
};