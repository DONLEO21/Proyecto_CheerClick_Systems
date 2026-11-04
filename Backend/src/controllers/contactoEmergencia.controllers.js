import { dbCreateContactoE, dbDeleteContactoE, dbGetContactoE, dbUpdateContactoE } from "../services/contactoEmergencia.services.js";

const getContactoEmergencia = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetContactoE(id);

        res.json({
            msg: 'Obtiene un contacto de emergencia',
            data: data
        })
    }
    catch (error) {
        console.error(error);

        if (error.name == 'CastError') {
            return res.json({
                msg: `El ID debe tener 24 caracteres  y el enviado tiene ${id.length}`,
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
            });
        }
        res.json({
            msg: 'No se puede obtener el contacto de emergencia por ID'
        });
    }
}

const createContactoEmergencia = async (req, res) => {
    try {
        
    const inputData = req.body;
    const data = await dbCreateContactoE(
        inputData
    );

    res.json({msg :'Registrar contacto de emergencia', data: data})
    }
    catch (error) {
        console.error(error);

        
        if(error.name == 'ValidationError'){
            const errors ={};

            //Iterar los erores para estraer el nombre de la propiedad y el error
            for(const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            
            res.json({errors})     //Retorna un error especifico
 
        } 

        res.json({msg: 'No se pudo registrar contacto de emergencia'})

    }
}

const updateContactoEmergencia = async (req, res) => {
    try{
        const id =  req.params.id;
        const inputData = req.body;

        const data = await dbUpdateContactoE (id, inputData)

        res.json({
            msg: 'Contacto de emergencia actualizada',
            data: data
        });
    }
    catch ( error ){
        console.error(error);

        res.json({
            msg: 'No se ha podido actualizar el contacto de emergencia'
        })
    }
}

const deleteContactoEmergencia =async (req, res) => {
    try {
        const id = req.params.id;
        const data = await dbDeleteContactoE(id);

        res.json ({
            msg: 'Elimine  un contacto de emergencia',
            data: data
        });
    }
    catch ( error ) {
        console.error(error);

        res.json({msg: 'No se ha podido eliminar el contacto de emergencia'})
    }
}

export {
    createContactoEmergencia,
    updateContactoEmergencia, 
    deleteContactoEmergencia,
    getContactoEmergencia
}