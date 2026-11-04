
import { dbCreateUsuario, dbGetUsuario, dbUpdateUsuario, dbDeleteUsuario } from "../services/usuarios.services.js"
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
        const id = userFound._id ? userFound._id : null;

        // Extrae los datos del cuerpo de la peticion
        const usuario = req.body;
        usuario.createdBy =  id; 

        //Encripta la contraseña antes de guardarla en la base de datos (opcional, pero recomendado)
        usuario.contrasena = generarPassword(usuario.contrasena);

        const newUsuario = await dbCreateUsuario(usuario);      //Llega como una Promesa (Promise)

        //Respuesta al cliente
        res.json({ mensaje: 'Registra usuario', usuario: newUsuario });
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

        res.send( 'Error al registrar usuario' )
    }
}


const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const data = await dbUpdateUsuario(id, inputData);

        res.json({
            msg: 'Usuario Actualizado',
            data: data
        });
    }
    catch ( error){
        console.error( error);

        res.json({
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
