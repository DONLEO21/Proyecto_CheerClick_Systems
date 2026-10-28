//Controlador define quien hace una accion especifica

import { dbCreateHorario, dbdeleteHorario, dbgetdHorario, dbGetHorarios, dbupdateHorario} from "../services/horarios.services.js";

const getHorario = async (req, res) => {
    try {
        const inputData=req.body;

        const data = await dbgetdHorario(inputData);

        res.status(201).json({msg: 'Consulte los horarios', data : data})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo consultar los horarios'})  
    }
}

const createHorario = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateHorario(inputData);

        res.json({msg : 'Registre un horario', data: data})
        
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
        res.status(500).json({msg: 'No se pudo registrar un horario'})

    }
}

const updateHorario = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData=req.body

        const data = await dbupdateHorario(id, inputData);

        res.json({msg: 'Actualiza un horario', data: data});
        
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
        res.status(500).json({msg: 'No se pudo actualizar un horario'})
    }
}

const deleteHorario = async  (req, res) => {
    const id= req.params.id;
    try {
        const data = await dbdeleteHorario(id);

        res.json({msg: 'Elimine un horario', data: data});
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg: 'No se pudo eliminar un horario'})
        
    }
}

const getHorarios = async (req, res) => {
    const id = req.params.id
    try {
    const data = await dbGetHorarios(id);

    res.json({msg: 'Obtiene un horario', data: data})
        
    } catch (error) {
        console.error(error);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se puede obtener un horario'})
    }
}

export {
    getHorario,
    createHorario,
    updateHorario,
    deleteHorario,
    getHorarios
}