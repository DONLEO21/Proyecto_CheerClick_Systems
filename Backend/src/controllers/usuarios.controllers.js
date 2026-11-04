import { generarPassword } from "../helpers/bcrypt.helpers.js";
import { dbCreateUsuario, dbGetUsuario } from "../services/usuarios.services.js"

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
        const userFound = req.userFound;


        // Usa un operador ternario para asignar el valor de _id a la variable id o null si no existe
       const id = userFound?._id || null;
    
        //obtenemos el usuario desde le cuerpó de la peticion (Request)
        const usuario = req.body;
        usuario.createBy = id;

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


const updateUsuarioP = (req, res) => {
    res.send( 'Actualizar parcialmente las propiedades de los usuarios')
}

const updateUsuario = (req, res) => {
    res.send( 'Actualizar todas las propiedades de los usuarios')
}

const deleteUsuario = (req, res) => {
    res.send( 'Eliminar usuarios')
}
export{
    getUsuario,
    createUsuario,
    updateUsuario,
    updateUsuarioP,
    deleteUsuario
}
