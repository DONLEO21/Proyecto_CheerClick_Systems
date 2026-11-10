import { dbCreateUsuario, dbGetUsuario, dbUpdateUsuario, dbDeleteUsuario, dbGetUserByEmail } from "../services/usuarios.services.js"
import { generarPassword } from "../helpers/bcrypt.helpers.js";

//Controlador define quien hace una accion especifica
const getUsuario = async (req, res) => {
     const id = req.params.id;
    try {

        const data = await dbGetUsuario(id);

        res.json({
            msg: 'Obtiene un usuario',
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
            msg: 'No se puede obtener el usuario por ID'
        })
    }
}
const createUsuario = async (req, res) => {
    try {
           //Extraer el _id del userFound usando una desestructuracion del payload qu envia en el req con l peticion el Middlewar de Aunticacion
        const userFound = req.userFound
        // Usa un operador ternario para asignar el valor de _id a la variable id, o null si no existe 
        const id = userFound?._id ? userFound._id : null;

        // Extrae los datos del cuerpo de la peticion
        const usuario = req.body;
        usuario.createdBy =  id; 

        // Contraseña con mínimo de 8 caracteres 
        if (!usuario.contrasena || usuario.contrasena.length < 8) {
            return res.status(400).json({ errors: { contrasena: 'La contraseña debe tener mínimo 8 caracteres' } });
        }

        // El correo no puede estar ya registrado
        if (await dbGetUserByEmail(usuario.email)) {
            return res.status(409).json({ errors: { email: 'Este correo ya está registrado' } });
        }

        //Encripta la contraseña antes de guardarla en la base de datos
        usuario.contrasena = generarPassword(usuario.contrasena);

        const newUsuario = await dbCreateUsuario(usuario);

        res.status(201).json({ mensaje: 'Registra usuario', usuario: newUsuario });
    }
    catch (error) {
        console.error(error);

        if(error.name == 'ValidationError'){
            const errors ={};

            //Iterar los errores para extraer el nombre de la propiedad y el error
            for(const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            
            return res.status(400).json({errors})
        } 

        res.status(500).send( 'Error al registrar usuario' )
    }
}


const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        // Campos que no se pueden modificar desde aquí
        delete inputData.createdBy;
        delete inputData.resetCodeHash;
        delete inputData.resetCodeExpires;
        delete inputData.resetAttempts;
        delete inputData.codigo;
        delete inputData.estadoSolicitud;
        delete inputData.rol;
        delete inputData.status;

        // Si se envia una contraseña nueva, se valida y se encripta antes de guardarla
        if (inputData.contrasena) {
            if (inputData.contrasena.length < 8) {
                return res.status(400).json({ errors: { contrasena: 'La contraseña debe tener mínimo 8 caracteres' } });
            }
            inputData.contrasena = generarPassword(inputData.contrasena);
        }

        const data = await dbUpdateUsuario(id, inputData);

        if (!data) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // No devolver la contraseña al cliente
        const jsonObj = data.toObject();
        delete jsonObj.contrasena;

        res.json({
            msg: 'Usuario Actualizado',
            data: jsonObj
        });
    }
    catch ( error){
        console.error( error);

        res.status(500).json({
            msg: 'No se ha podido actualizar el usuario'
        })
    }
}

const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await dbDeleteUsuario(id);

        res.json ({
            msg: 'Usuario eliminado',
            data: data
        })
    }
    catch ( error) {
        console.error (error);

        res.json({
            msg: 'No se ha podido eliminar el usuario'
        })
    }
}
export{
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
}
