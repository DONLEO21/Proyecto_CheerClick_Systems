import { dbCreateEps, dbDeleteEps, dbGetEps, dbUpdateEps } from "../services/eps.services.js";

const createEps = async (req, res) => {
    try {
        const inputData = req.body;

    //Usar el servicio para registrar
    const data = await dbCreateEps(inputData)

    res.status(201).json({ msg: 'Registrar eps', data: data})
    }
    catch (error){
        console.error(error);

        if(error.code == 11000){
            
            const field = Object.keys(error.keyValue)[0]

            //Mensaj de error que se la envia al usuario
            return res.status(400).json ( {
                msg: `Error por duplicado en el campo '${field}'`,
                [field] : `El ${field} ${error.keyValue[ field] } ya se encuentra registrado`
            });
        }

        if(error.name == 'ValidationError'){
            const errors ={};

            //Iterar los erores para estraer el nombre de la propiedad y el error
            for(const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            
            res.status(400).json({errors})     //Retorna un error especifico
 
        } 
        res.status(500).json({ msg :'No se pudo registrar la EPS'})    //Retorna un error generico 
    }
}

const getEps = async (req, res) => {
    try {
        const data =  await dbGetEps();

        res.status(200).json({
            msg: 'Lista de EPS',
            data: data
        })
    }
    catch ( error ) {

        if(error.name == 'CastError') {
            return res.json({msg: 'Error en el formato del ID', [error.path]: `El identificador ${error.value} no tiene el formato valido que reuiere MongoDB`});
        }
        console.error(error);

        res.json({
            msg: 'No se ha podido listar las eps'
        })
    }
}

const deleteEps = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteEps(id);

        res.json ({
            msg : 'Elimine una EPS',
            data : data
        });
    }
    catch ( error ) {
        console.error(error);

        res.json({
            msg: 'No se ha podido eliminar la eps'
        })
    }
}

const updateEps = async (req, res) => {
    try {
        const id =  req.params.id;
        const inputData = req.body;
    
        const data = await dbUpdateEps(id, inputData);

        res.json({
            msg: 'Eps Actualizada',
            data: data
        });
    }
    catch ( error ){
        console.error(error);

        res.json({
            msg: 'No se ha podido actualizar la eps'
        })
    }
}

export {
    createEps, 
    getEps,
    deleteEps,
    updateEps
}