import { dbCreateNivel, dbGetNivel, dbGetNiveles, dbUpdateNivel } from "../services/niveles.services.js";

const createNivel = async (req, res) => {
    try {
        const inputData = req.body;
        const data = await dbCreateNivel(inputData);

        res.status(201).json({ msg: 'Registrar un nivel', data: data });

    } catch (error) {
        console.error(error);

        // Error de duplicado
        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        // Error de validación
        if (error.name == 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }

        res.status(500).json({ msg: 'No se pudo registrar un nivel' });
    }
}

const getNivel = async (req, res) => {
    try {
        const data = await dbGetNivel(req.query, req.userFound); 
        res.json({ msg: 'Consulta los niveles', data: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'No se pudo consultar los niveles' });
    }
}

const updateNivel = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body;
        const data = await dbUpdateNivel(id, inputData);

        if (!data) return res.status(404).json({ msg: 'Nivel no encontrado' });

        res.json({ msg: 'Actualiza un nivel', data: data });

    } catch (error) {
        console.error(error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }

        if (error.name == 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }

        res.status(500).json({ msg: 'No se pudo Actualizar el nivel' });
    }
}

const getNiveles = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetNiveles(id, req.userFound); 

        if (!data) return res.status(404).json({ msg: 'Nivel no encontrado' });

        res.json({ msg: 'Obtiene un nivel', data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.status(400).json({
                msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }
        res.status(500).json({ msg: 'No se pudo obtener el nivel' });
    }
}

export {
    createNivel,
    getNivel,
    updateNivel,
    getNiveles
}
