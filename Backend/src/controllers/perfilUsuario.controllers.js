import { dbCreatePerfilUsuario, dbGetPerfilUsuario, dbUpdatePerfilUsuario, dbDeletePerfilUsuario} from "../services/perfilUsuario.services.js"

const createPerfilUsuario = async (req, res) => {
    try {

        const user_id = req.userFound._id;

        const perfilUsuario = req.body;
        perfilUsuario.perteneceA = user_id;

        if (perfilUsuario.genero === 'Otro' && !perfilUsuario.generoOtro?.trim()) {
        return res.status(400).json({ errors: { generoOtro: 'Escribe tu género' } });
        }
        if (perfilUsuario.eps === 'Otra' && !perfilUsuario.epsOtra?.trim()) {
            return res.status(400).json({ errors: { epsOtra: 'Escribe el nombre de tu EPS' } });
        }

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

        // Un perfil no se puede pasar a otro usuario
        delete inputData.perteneceA;

        if (inputData.genero && inputData.genero !== 'Otro') inputData.generoOtro = null;
        if (inputData.eps && inputData.eps !== 'Otra') inputData.epsOtra = null;

        // Si se eligió "Otro", el texto es obligatorio
        if (inputData.genero === 'Otro' && !inputData.generoOtro?.trim()) {
            return res.status(400).json({ errors: { generoOtro: 'Escribe tu género' } });
        }
        if (inputData.eps === 'Otra' && !inputData.epsOtra?.trim()) {
            return res.status(400).json({ errors: { epsOtra: 'Escribe el nombre de tu EPS' } });
        }

        const data = await dbUpdatePerfilUsuario(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'Perfil no encontrado' });
        }

        res.json({
            msg: 'Perfil de usuario actualizado',
            data: data
        })
    }
    catch ( error ){
        console.error( error);

        if (error.code === 11000) {
            return res.status(409).json({ errors: { numDocumento: 'Este número de documento ya está registrado' } });
        }

        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) errors[field] = error.errors[field].message;
            return res.status(400).json({ errors });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'El ID no tiene un formato válido' });
        }

        res.status(500).json({
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