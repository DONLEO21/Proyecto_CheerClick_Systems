import { dbCreatePqrs, dbGetpqrs, dbGetPqrs, dbUpdatePqrs } from "../services/pqrs.services.js";

// Respuestas repetidas, para no copiar el mismo código en cada función
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

const createPqrs = async (req, res) => {
    try {
        // CAMBIO: solo se toman los campos del formulario.
        // Así el atleta no puede enviar estado, prioridad o usuario por su cuenta.
        const { tipo, asunto, descripcion, evidencia } = req.body;

        const data = await dbCreatePqrs({
            tipo,
            asunto,
            descripcion,
            evidencia,
            usuario: req.userFound._id    // CAMBIO: el remitente es el usuario autenticado
        });

        res.status(201).json({ msg: 'Registra una Pqrs', data: data });

    } catch (error) {
        console.error(error);

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

        res.status(500).json({ msg: "No se pudo registrar la Pqrs" });
    }
}

const getPqrs = async (req, res) => {
    try {
        const data = await dbGetPqrs(req.userFound);

        res.json({ msg: 'Consulta las Pqrs', data: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'No se pudo consultar las Pqrs' });
    }
}

// CAMBIO: este PATCH ahora es del Administrador (botones Modificar / Habilitar / Inhabilitar).
// Solo puede cambiar estado (Activo/Inactivo), etapa (trámite) y prioridad.
const updatePqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const campos = {};
        for (const campo of ['estado', 'etapa', 'prioridad']) {
            if (req.body[campo] !== undefined) campos[campo] = req.body[campo];
        }

        const data = await dbUpdatePqrs(id, campos);
        if (!data) return res.status(404).json({ msg: 'Pqrs no encontrada' });

        res.json({ msg: 'Actualiza una Pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') return idInvalido(res, id, error);

        if (error.name == 'ValidationError') {
            return res.status(400).json({ errors: erroresValidacion(error) });
        }

        res.status(500).json({ msg: 'No se pudo actualizar la pqrs' });
    }
}

const getpqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetpqrs(id, req.userFound);
        if (!data) return res.status(404).json({ msg: 'Pqrs no encontrada' });

        res.json({ msg: 'Obtiene una Pqrs', data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') return idInvalido(res, id, error);
        res.status(500).json({ msg: "No se puede obtener una Pqrs" });
    }
}

export {
    createPqrs,
    getPqrs,
    updatePqrs,
    getpqrs
}