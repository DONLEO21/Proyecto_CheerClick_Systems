import { dbCreateCompetencia, dbDeleteCompetencia, dbGetCompetencia, dbUpdateCompetencia, dbGetCompetencias} from "../services/competencias.services.js";


const getCompetencia = async (req, res) => {
    try {
     const inputData=req.body;
     const data = await dbGetCompetencia(inputData);

     res.json({msg: "Consulta todas las competencias", data: data});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "No se pudo consultar las competencias"})
        
    }
}

const createCompetencia = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateCompetencia(inputData);

        res.status(201).json({msg: "Registra una competencia", data: data})
        
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
        res.status(500).json({msg: "No se pudo regitrar la competencia"})
    }

}

const deleteCompetencia = async (req, res) => {
    const id = req.params.id;
    try {
    const data = await dbDeleteCompetencia( id );

    res.json({ msg : 'Elimina una plantilla de horarios', data: data });
        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg: "No se pudo eliminar la competencia"});
        
    }


}

const updateCompetencia = async (req, res) => {
    const id = req.params.id;
    try {
        const inputData = req.body

        const data = await dbUpdateCompetencia(id, inputData);
        res.json({msg: 'Actualiza una competencia', data: data});
        
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
        } else {
            res.status(500).json({msg: 'No se pudo registrar una competencia'})
        }
 
    }
}

const getCompetencias = async (req, res) => {
    const id = req.params.id
    try {
        const data = await dbGetCompetencias(id);

        res.json({msg: 'Obtiene una competencia', data: data})

        
    } catch (error) {
        console.error(error);
        console.log('ID', id);

        if(error.name == 'CastError') {
            return res.status(400).json({msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.length}`, [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }
        res.status(500).json({msg : 'No se puede obtener una competencia'})
        
    }
}




export { 
    getCompetencia,
    createCompetencia,
    deleteCompetencia,
    updateCompetencia,
    getCompetencias
}