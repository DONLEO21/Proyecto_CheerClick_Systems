import { dbCreatePlanAsociado, dbDeletePlanAsociado, dbGetPlanAsociado, dbGetPlanesAsociados, dbUpdatePlanAsociado } from "../services/planAsociado.sevices.js";

const CreatePlanAsociado = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreatePlanAsociado(inputData);

        return res.status(201).json({ msg: 'Registra un plan asociado', data: data });
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

        return res.status(500).json({ msg: 'No se pudo registrar el plan asociado' });
    }
};

const GetPlanAsociado = async (req, res) => {
    try {
        const data = await dbGetPlanAsociado();

        return res.status(200).json({ msg: 'Consultar todos los planes asociados', data: data });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ msg: 'No se pudo consultar los planes asociados' });
    }
};

const DeletePlanAsociado = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbDeletePlanAsociado(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el plan asociado a eliminar' });
        }

        return res.status(200).json({ msg: 'Eliminar un plan asociado', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo eliminar el plan asociado' });
    }
};

const UpdatePlanAsociado = async (req, res) => {
    const id = req.params.id;

    try {
        const inputData = req.body;

        const data = await dbUpdatePlanAsociado(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el plan asociado a actualizar' });
        }

        return res.status(200).json({ msg: 'Actualizar los campos del plan asociado', data: data });
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

        return res.status(500).json({ msg: 'No se pudo actualizar el plan asociado' });
    }
};

const GetPlanesAsociados = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await dbGetPlanesAsociados(id);

        if (!data) {
            return res.status(404).json({ msg: 'No se encontró el plan asociado' });
        }

        return res.status(200).json({ msg: 'Consultar uno de los planes por su ID', data: data });
    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `Error en el formato del ID debe tener 24 caracteres el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        return res.status(500).json({ msg: 'No se pudo encontrar el plan asociado' });
    }
};

export {
    CreatePlanAsociado,
    GetPlanAsociado,
    DeletePlanAsociado,
    UpdatePlanAsociado,
    GetPlanesAsociados
};