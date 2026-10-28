import { dbCreateRespuesta_pqrs, dbDeleteRespuesta_pqrs, dbGetrespuesta_pqrs, dbGetRespuesta_pqrs, dbUpdateRespuesta_pqrs } from "../services/respuesta_pqrs.services.js";

const createRespuesta_pqrs = async (req, res) => {
    try {
        const inputData = req.body;
        const data = await dbCreateRespuesta_pqrs(inputData);

        res.json({msg: 'Registra una Respuesta de pqrs', data: data});
        
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
        res.status(500).json({msg: 'No se pudo registrar una respuesta de pqrs'})
    }

}

const getRespuesta_pqrs = async (req, res) => {
    try {
        const inputData = req.body;
        const data = await dbGetRespuesta_pqrs(inputData);
        res.json({msg: 'Consulta las Respuestas de pqrs', data: data})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo consultar las Respuestas de pqrs'}) 
    }

}

const deleteRespuesta_pqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbDeleteRespuesta_pqrs(id);
        res.json({msg: 'Elimina una Respuesta de pqrs', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se pudo eliminar la Respuesta de pqrs'})
        
    }

}

const updateRespuesta_pqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body
        const data = await dbUpdateRespuesta_pqrs(id, inputData);
        res.json({msg: 'Actualiza una Respuesta de pqrs', data: data})

        
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
        res.status(500).json({msg: 'No se pudo Actualizar la Respuesta de pqrs'})
    }
}

const getrespuesta_pqrs = async (req, res) => {
    const id = req.params.id
    try {
        const data = await dbGetrespuesta_pqrs(id);
        res.json({msg: 'Obtiene una Respuesta de pqrs', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se pudo obtener la Respuesta de pqrs'})
        
    }
}

export {
    createRespuesta_pqrs,
    getRespuesta_pqrs,
    deleteRespuesta_pqrs,
    updateRespuesta_pqrs,
    getrespuesta_pqrs
}