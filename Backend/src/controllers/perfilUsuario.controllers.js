import { dbCreatePerfilUsuario, dbGetPerfilUsuario, dbUpdatePerfilUsuario, dbDeletePerfilUsuario} from "../services/perfilUsuario.services.js"

const createPerfilUsuario = async (req, res) => {
    try {

        const user_id = req.userFound._id;

        const perfilUsuario = req.body;
        perfilUsuario.perteneceA = user_id;

        const newPerfilUsuario = await dbCreatePerfilUsuario(perfilUsuario);

        res.json ({
            msj: 'Registra perfil de usuario',
            perfilUsuario: newPerfilUsuario
        })
    }
    catch (error) {
        console.error('Error detallado:', error); // Error detallado en consola

        if(error.name == 'ValidationError'){
            const errors ={};
            for(const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        } 

        // Respuesta por defecto para cualquier otro error 
        return res.status(500).json({
            msg: 'No se ha podido registrar el perfil de usuario',
            error: error.message
        });
    }
}

const getPerfilUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await dbGetPerfilUsuario(id);

        res.json({
            msg: 'Obtiene un perfil de usuario',
            data: data
        })
    }
    catch ( error ){
        console.error( error );

        if(error.name == 'CastError') {
            return res.json({
                msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.lenght}`, 
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }

        res.json({
            msg: 'No se puede obtener el perfil de usuario por ID'
        })
    }
}

const updatePerfilUsuario = async ( req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdatePerfilUsuario(id, inputData);

        res.json({
            mesg: 'Perfil de usuario actualizado',
            data: data
        })
    }
    catch ( error ){
        console.error( error);

        if(error.name == 'CastError') {
            return res.json({
                msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.lenght}`, 
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }

        res.json({
            msg: 'No se ha podido actualizar el perfil de usuario por ID'
        })
    }
}

const deletePerfilUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await dbDeletePerfilUsuario(id);

        res.json ({
            msg: 'Perfil de usuario eliminado',
            data: data
        })
    }
    catch ( error) {
        console.error (error);

        if(error.name == 'CastError') {
            return res.json({
                msg: `El ID debe tener 24 caracteres y el enviado tiene ${id.lenght}`, 
                [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`});
        }

        res.json({
            msg: ' No se ha podido eliminar el perfil de usuario por ID'
        })
    }
}

export{
    createPerfilUsuario,
    getPerfilUsuario,
    updatePerfilUsuario,
    deletePerfilUsuario
}