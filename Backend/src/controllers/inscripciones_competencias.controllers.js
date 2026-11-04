import { dbCreateInscripcion_competencia, dbDeleteInscripcion_competencia, dbGetInscripcion_competencia, dbGetInscripciones_competencias, dbUpdateInscripcion_competencia, dbFindInscripcionDuplicada } from "../services/inscripciones_competencias.services.js";
import { dbGetCompetencias } from "../services/competencias.services.js";

// El Atleta se inscribe a una competencia de su nivel
const createInscripcion_competencia = async (req, res) => {
    try {
        const inputData = req.body;

        // El usuario sale del token, nunca del body (evita inscribir a otra persona)
        inputData.usuario = req.userFound._id;

        // Valida que venga la competencia
        if (!inputData.competencia) {
            return res.status(400).json({ msg: 'Debe indicar la competencia' });
        }

        // Busca la competencia para validar que exista, este activa y sea del nivel del atleta
        const competencia = await dbGetCompetencias(inputData.competencia);

        if (!competencia || competencia.estado !== 'Activo') {
            return res.status(404).json({ msg: 'La competencia no existe o no esta activa' });
        }

        // Si el atleta no tiene nivel asignado o la competencia es de otro nivel
        if (!req.userFound.nivel || !competencia.nivel.equals(req.userFound.nivel)) {
            return res.status(403).json({ msg: 'Esta competencia no pertenece a tu nivel' });
        }

        // Valida la fecha limite de inscripcion
        if (competencia.fechalimite && competencia.fechalimite < new Date()) {
            return res.status(400).json({ msg: 'La fecha limite de inscripcion ya paso' });
        }

        // Evita inscripcion duplicada
        const yaInscrito = await dbFindInscripcionDuplicada(inputData.competencia, req.userFound._id);
        if (yaInscrito) {
            return res.status(409).json({ msg: 'Ya estas inscrito en esta competencia' });
        }

        const data = await dbCreateInscripcion_competencia(inputData);

        res.status(201).json({ msg: 'Registrar una Inscripcion a Competencia', data: data });

    } catch (error) {
        console.error(error);

        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field]: `El '${field}' de '${error.keyValue[field]}' ya se encuentra registrado`
            });
        }

        // Id de competencia con formato invalido
        if (error.name == 'CastError') {
            return res.status(400).json({ msg: 'El identificador enviado no tiene el formato valido que requiere MongoDB', [error.path]: `El identificador ${error.value} no es valido` });
        }

        if (error.name == 'ValidationError') {
            const errors = {};

            // Iterar los errores para extraer el nombre de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });  // <- return: evita ERR_HTTP_HEADERS_SENT
        }

        res.status(500).json({ msg: 'No se pudo registrar una inscripcion a competencia' });
    }
}

// LISTA las inscripciones segun el rol
// - Atleta: solo las suyas
// - Administrador: todas
const getInscripcion_competencia = async (req, res) => {
    try {
        const { _id, rol } = req.userFound;

        const data = await dbGetInscripcion_competencia(rol, _id);

        res.json({ msg: 'Consulta las Inscripciones a competencias', data: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'No se pudo consultar las inscripciones de las comptencias' });
    }
}

// Actualiza una inscripcion (solo el Administrador, lo controla la ruta)
const updateInscripcion_competencia = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body;

        // Evita que se cambie el dueño o la competencia de la inscripcion
        delete inputData.usuario;
        delete inputData.competencia;

        const data = await dbUpdateInscripcion_competencia(id, inputData);

        // Si no existe una inscripcion con ese id
        if (!data) {
            return res.status(404).json({ msg: 'Inscripcion no encontrada' });
        }

        res.json({ msg: 'Actualiza una Inscripcion a competencia', data: data });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

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
            return res.status(400).json({ errors });  // <- return: evita ERR_HTTP_HEADERS_SENT
        }

        res.status(500).json({ msg: 'No se pudo Actualizar la inscripcion a competencia' });
    }
}

// Elimina una inscripcion
// - Atleta: solo las suyas
// - Administrador: cualquiera
const deleteInscripcion_competencia = async (req, res) => {
    const id = req.params.id;
    try {
        const { _id, rol } = req.userFound;

        // El Atleta solo puede eliminar sus propias inscripciones
        const filtroExtra = rol === 'Atleta' ? { usuario: _id } : {};

        const data = await dbDeleteInscripcion_competencia(id, filtroExtra);

        // No existe o no le pertenece al Atleta
        if (!data) {
            return res.status(404).json({ msg: 'Inscripcion no encontrada o no tienes permiso para eliminarla' });
        }

        res.json({ msg: 'Elimina una inscripcion a competencia', data: data });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }
        res.status(500).json({ msg: 'No se pudo eliminar la Inscripcion a competencia' });
    }
}

// Obtiene UNA inscripcion por id
// - Atleta: solo si es suya
// - Administrador: cualquiera
const getInscripciones_competencias = async (req, res) => {
    const id = req.params.id;
    try {
        const { _id, rol } = req.userFound;

        const data = await dbGetInscripciones_competencias(id);

        // Si no existe una inscripcion con ese id
        if (!data) {
            return res.status(404).json({ msg: 'Inscripcion no encontrada' });
        }

        // El Atleta solo puede ver sus propias inscripciones
        if (rol === 'Atleta' && !(data.usuario && data.usuario._id.equals(_id))) {
            return res.status(403).json({ msg: 'No tienes acceso a esta inscripcion' });
        }

        res.json({ msg: 'Obtiene una Inscripcion de una competencia', data: data });

    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if (error.name == 'CastError') {
            return res.status(400).json({ msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB` });
        }
        res.status(500).json({ msg: 'No se pudo obtener la Inscripcion a competencia' });
    }
}

export {
    createInscripcion_competencia,
    getInscripcion_competencia,
    updateInscripcion_competencia,
    deleteInscripcion_competencia,
    getInscripciones_competencias
}