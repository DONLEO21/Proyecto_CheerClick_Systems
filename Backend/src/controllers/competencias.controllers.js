import { dbCreateCompetencia, dbDeleteCompetencia, dbGetCompetencia, dbUpdateCompetencia, dbGetCompetencias } from "../services/competencias.services.js";

// LISTA las competencias según el rol del usuario
// - Administrador: todas las de todos los niveles (o las de un nivel con ?nivel=ID)
// - Atleta: solo las ACTIVAS de SU nivel
const getCompetencia = async (req, res) => {
    try {
        // Rol y nivel del usuario autenticado (los deja el authMiddleware en req.userFound)
        const { rol, nivel } = req.userFound;

        // Filtro opcional por query: GET /api/competencias?nivel=ID (solo aplica al Administrador)
        const nivelQuery = req.query.nivel;

        const data = await dbGetCompetencia(rol, nivel, nivelQuery);

        res.json({ msg: "Consulta todas las competencias", data: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "No se pudo consultar las competencias" });
    }
}

const createCompetencia = async (req, res) => {
    try {
        // Extrae el ID del usuario encontrado por el Middleware de Autentication
        const { _id } = req.userFound;

        // Extrae los datos del cuerpo de la peticion (el nivel lo elige el Administrador en el formulario)
        const inputData = req.body;
        inputData.createBy = _id; // <---- Agrega el ID del usuario que registra la competencia

        // Valida que el formulario haya enviado el nivel
        if (!inputData.nivel) {
            return res.status(400).json({ msg: "Debe indicar el nivel de la competencia" });
        }

        const data = await dbCreateCompetencia(inputData);

        res.status(201).json({ msg: "Registra una competencia", data: data });

    } catch (error) {
        console.error(error);

        if (error.name == 'ValidationError') {
            const errors = {};

            // Iterar los errores para extraer el nombre de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });  // <- return: evita ERR_HTTP_HEADERS_SENT
        }

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        res.status(500).json({ msg: "No se pudo regitrar la competencia" });
    }
}

const deleteCompetencia = async (req, res) => {
    const id = req.params.id;
    const user_id = req.userFound._id;
    try {
        const data = await dbDeleteCompetencia(id);

        // Si no existe una competencia con ese id
        if (!data) {
            return res.status(404).json({ msg: 'Competencia no encontrada' });
        }

        res.json({ msg: 'Elimina una competencia', data: data, deleteBy: user_id });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }
        res.status(500).json({ msg: "No se pudo eliminar la competencia" });
    }
}

const updateCompetencia = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body;

        // Evita que se cambie quien creo la competencia
        delete inputData.createBy;

        const data = await dbUpdateCompetencia(id, inputData);

        // Si no existe una competencia con ese id
        if (!data) {
            return res.status(404).json({ msg: 'Competencia no encontrada' });
        }

        res.json({ msg: 'Actualiza una competencia', data: data });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

        // Primer error
        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        // Segundo Error
        if (error.name == 'CastError') {
            return res.status(400).json({ msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }

        // Tercer Error
        if (error.name == 'ValidationError') {
            const errors = {};

            // Iterar los errores para extraer el nombre de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        }

        res.status(500).json({ msg: 'No se pudo actualizar la competencia' });
    }
}

// Obtiene UNA competencia por id
// - Administrador: puede ver cualquiera
// - Atleta: solo si esta ACTIVA y es de SU nivel
const getCompetencias = async (req, res) => {
    const id = req.params.id;
    try {
        const { rol, nivel } = req.userFound;

        const data = await dbGetCompetencias(id);

        // Si no existe una competencia con ese id
        if (!data) {
            return res.status(404).json({ msg: 'Competencia no encontrada' });
        }

        // El Atleta solo puede ver competencias ACTIVAS de SU nivel
        if (rol === 'Atleta' && (data.estado !== 'Activo' || !data.nivel.equals(nivel))) {
            return res.status(403).json({ msg: 'No tienes acceso a esta competencia' });
        }

        res.json({ msg: 'Obtiene una competencia', data: data });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }
        res.status(500).json({ msg: 'No se puede obtener una competencia' });
    }
}

export {
    getCompetencia,
    createCompetencia,
    deleteCompetencia,
    updateCompetencia,
    getCompetencias
}