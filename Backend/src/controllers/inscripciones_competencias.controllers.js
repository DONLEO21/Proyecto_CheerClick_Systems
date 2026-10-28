import { dbCreateInscripcion_competencia, dbDeleteInscripcion_competencia, dbGetInscripcion_competencia, dbGetInscripciones_competencias, dbUpdateInscripcion_competencia } from "../services/inscripciones_competencias.services.js"

const createInscripcion_competencia = async (req, res) => {
    try {
        const inputData =req.body
        const data = await dbCreateInscripcion_competencia(inputData);

        res.status(201).json({msg: 'Registrar una Inscripcion a Competencia', data: data});

    } catch (error) {
        console.error(error)

        if(error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json ({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field] : `El '${ field }' de '${error.keyValue[ field ]}' ya se encuentra registrado` 
            });

        }
        if(error.name == 'ValidationError'){
            const errors = {};

            // Iterar los errores para extraer la fecha de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message; // <- Cambiado de errors(field) a errors[field]
            }
            res.status(400).json({errors})
        } 
        res.status(500).json({msg: 'No se pudo registrar una inscripcion a competencia'});
        
    }
}

const getInscripcion_competencia = async (req, res) => {
    try {
        const inputData = req.body
        const data = await dbGetInscripcion_competencia(inputData);
        res.json({msg: 'Consulta las Inscripciones a competencias', data: data});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo consultar las inscripciones de las comptencias'});
    }

}

const updateInscripcion_competencia = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body
        const data = await dbUpdateInscripcion_competencia(id, inputData);

        res.json({msg: 'Actualiza una Inscripcion a competencia', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json ({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field] : `El '${ field }' de '${error.keyValue[ field ]}' ya se encuentra registrado` 
            });

        }
        // Segundo Error
        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }

        // Tercer Error
        if(error.name == 'ValidationError'){
            const errors = {};

            // Iterar los errores para extraer la fecha de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message; // <- Cambiado de errors(field) a errors[field]
            }
            res.status(400).json({errors})
        } 
        res.status(500).json({msg: 'No se pudo Actualizar la inscripcion a competencia'});
        
    }
}

const deleteInscripcion_competencia = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbDeleteInscripcion_competencia(id);

        res.json({msg: 'Elimina una inscripcion a competencia', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se pudo eliminar la Inscripcion a competencia'})
    }
}
const getInscripciones_competencias = async (req, res) => {
    const id = req.params.id
    try {
        const data = await dbGetInscripciones_competencias(id);

        res.json({msg: 'Obtiene una Inscripcion de una competencia', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se pudo obtener la Inscripcion a competencia'});
    }
}

export {
    createInscripcion_competencia,
    getInscripcion_competencia,
    updateInscripcion_competencia,
    deleteInscripcion_competencia,
    getInscripciones_competencias
}