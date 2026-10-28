import { dbCreatePlantilla_horario, dbDeletePlantilla_horario, dbGetPlantilla_horario, dbGetPlantilla_horarios, dbUpdatePlantilla_horario } from "../services/plantilla_horarios.services.js";

const createPlantillahorario = async (req, res) => {
    try {
    // Extrae los datos del cuerpo de la peticion
    const inputData = req.body;
    // Usar el servicio para registrar
    const data = await dbCreatePlantilla_horario(inputData);
  
    res.status(201).json({msg: 'Registra la plantilla de horario', data : data});
        
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
        res.status(500).json({msg: "No se pudo regitrar la plantilla de horario"})
    }
}

const getPlantillahorario = async (req, res) => {
    try {
        const inputData=req.body;

        const data = await dbGetPlantilla_horario(inputData);

        res.json({msg: 'Consulta las plantillas de horarios', data : data});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "No se pudo consultar las plantillas de horarios"})
    }
}

const deletePlantillahorario = async (req, res) => {
    const id = req.params.id;
    try {
        const data =  await dbDeletePlantilla_horario(id);

        res.json({ msg : 'Elimina una plantilla de horarios', data: data });
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
    res.status(500).json({msg: "No se pudo eliminar la plantilla de horario"});
                


    }

}

const updatePlantillahorario= async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body

        const data = await dbUpdatePlantilla_horario(id, inputData);

        res.json({ msg : 'Actualiza una plantilla de horarios', data: data });
        
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
         res.status(500).json({msg: 'No se pudo actualizar una plantilla de horario'})
        
    }

}

const getPlantillahorarios = async (req, res) => {
    const id = req.params.id
    try {
        const data = await dbGetPlantilla_horarios(id);

        res.json({msg : 'Obtiene una plantilla de horario', data: data})
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg: "No se puede obtener una plantilla de horario"})
    }

}

export {
    createPlantillahorario,
    getPlantillahorario,
    deletePlantillahorario,
    updatePlantillahorario,
    getPlantillahorarios
}