import { dbCreatePqrs, dbDeletePqrs, dbGetpqrs, dbGetPqrs, dbUpdatePqrs } from "../services/pqrs.services.js";

const createPqrs = async (req, res) => {
    try {
        const inputData = req.body;
        const data = await dbCreatePqrs(inputData);

        res.status(201).json({msg: 'Registra una Pqrs', data : data});
        
    } catch (error) {
        console.error(error);
        if(error.name == 'ValidationError'){
            const errors = {};

            // Iterar los errores para extraer la fecha de la propiedad y el error especifico
            for (const field in error.errors) {
                errors[field] = error.errors[field].message; // <- Cambiado de errors(field) a errors[field]
            }
            res.status(400).json({errors})
        }
        if(error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json ({
                msg: `Error por duplicidad en el campo '${field}'`,
                [field] : `El '${ field }' de '${error.keyValue[ field ]}' ya se encuentra registrado` 
            });

        }
        res.status(500).json({msg: "No se pudo regitrar la Pqrs"})
    }
}


const getPqrs = async (req, res) => {
    try {
    const inputData=req.body;
    const data = await dbGetPqrs.apply(inputData);

    res.json({msg: 'Consulta las Pqrs', data: data});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo consultar las Pqrs'})
        
    }

}

const deletePqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbDeletePqrs(id);

        res.json({msg: 'Elimina una Pqrs', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
    res.status(500).json({msg: "No se pudo eliminar la Pqrs "});
        
    }

}

const updatePqrs = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body
        const data = await dbUpdatePqrs(id, inputData);

        res.json({msg: 'Actualiza una Pqrs', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        // Primer error
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
         res.status(500).json({msg: 'No se pudo actualizar la pqrs'})
        
    }
}

const getpqrs = async (req, res) => {
    const id = req.params.id
    try {
        const data = await dbGetpqrs(id);
        res.json({msg: 'Obtiene una Pqrs', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg: "No se puede obtener una Pqrs"})
    }
}
export {
    createPqrs,
    getPqrs,
    deletePqrs,
    updatePqrs,
    getpqrs
}
