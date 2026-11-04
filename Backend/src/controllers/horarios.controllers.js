import { dbCreateHorario, dbdeleteHorario, dbgetdHorario, dbGetHorarios, dbupdateHorario } from "../services/horarios.services.js";

// Respuestas repetidas, para no copiar el mismo código en cada función
const sinPermiso = (res, error) => res.status(403).json({ msg: error.message });

const idInvalido = (res, id, error) => res.status(400).json({
    msg: `El ID debe tener 24 caracteres y el enviado tiene ${id?.length}`,
    [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
});

const erroresValidacion = (error) => {
    const errors = {};
    for (const field in error.errors) {
        errors[field] = error.errors[field].message;
    }
    return errors;
};

const getHorario = async (req, res) => {
    try {
        // CAMBIO: se envía req.userFound para que el Entrenador solo vea sus niveles
        const data = await dbgetdHorario(req.query, req.userFound);
        res.json({ msg: 'Consulte los horarios', data: data });

    } catch (error) {
        console.error(error);
        if (error.status === 403) return sinPermiso(res, error);
        if (error.name == 'CastError') return idInvalido(res, error.value, error);
        res.status(500).json({ msg: 'No se pudo consultar los horarios' });
    }
}

const createHorario = async (req, res) => {
    try {
        const data = await dbCreateHorario(req.body, req.userFound);
        res.status(201).json({ msg: 'Registre un horario', data: data });

    } catch (error) {
        console.error(error);
        if (error.status === 403) return sinPermiso(res, error);
        if (error.name == 'CastError') return idInvalido(res, error.value, error);

        if (error.name == 'ValidationError') {
            return res.status(400).json({ errors: erroresValidacion(error) });
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        res.status(500).json({ msg: 'No se pudo registrar un horario' });
    }
}

const updateHorario = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbupdateHorario(id, req.body, req.userFound);
        if (!data) return res.status(404).json({ msg: 'Horario no encontrado' });

        res.json({ msg: 'Actualiza un horario', data: data });

    } catch (error) {
        console.error(error);
        if (error.status === 403) return sinPermiso(res, error);
        if (error.name == 'CastError') return idInvalido(res, id, error);

        if (error.name == 'ValidationError') {
            return res.status(400).json({ errors: erroresValidacion(error) });
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        res.status(500).json({ msg: 'No se pudo actualizar un horario' });
    }
}

const deleteHorario = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbdeleteHorario(id, req.userFound);
        if (!data) return res.status(404).json({ msg: 'Horario no encontrado' });

        res.json({ msg: 'Elimine un horario', data: data });

    } catch (error) {
        console.error(error);
        if (error.status === 403) return sinPermiso(res, error);
        if (error.name == 'CastError') return idInvalido(res, id, error);
        res.status(500).json({ msg: 'No se pudo eliminar un horario' });
    }
}

const getHorarios = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetHorarios(id, req.userFound);
        if (!data) return res.status(404).json({ msg: 'Horario no encontrado' });

        res.json({ msg: 'Obtiene un horario', data: data });

    } catch (error) {
        console.error(error);
        if (error.status === 403) return sinPermiso(res, error);
        if (error.name == 'CastError') return idInvalido(res, id, error);
        res.status(500).json({ msg: 'No se puede obtener un horario' });
    }
}

export {
    getHorario,
    createHorario,
    updateHorario,
    deleteHorario,
    getHorarios
}
