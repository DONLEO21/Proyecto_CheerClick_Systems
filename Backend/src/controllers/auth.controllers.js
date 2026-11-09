
import { verifyPassword } from "../helpers/bcrypt.helpers.js";
import { dbGetUserByEmail } from "../services/usuarios.services.js";
import { generateToken } from "../helpers/jwt.helpers.js";

const loginUser = async ( req, res ) => {

    try {
        // Paso 1: Obtener las credenciales del usuario
        const inputData = req.body;

        // Valida si el campo email no viene dentro de las inputData
        if( ! inputData.email ) {
            return res.status(400).json({
                msg: 'Olvido pasar el correo en el campo correo electrónico'
            });
        }

        // Valida si el campo password no viene dentro de las inputData
        if( ! inputData.contrasena ) {
            return res.status(400).json({
                msg: 'Olvido pasar la contraseña en el campo contraseña'
            });
        }

        // Paso 2: Verificar si usuario existe, si el email esta registrado en la BD
        const userFound = await dbGetUserByEmail( inputData.email );

        if( ! userFound ) {
            return res.status(404).json({
                msg: 'El usuario no existe. Por favor registrese'
            });
        }

        // Paso 3: Verificar si la contraseña es valida
        const isvalid = verifyPassword(inputData.contrasena, userFound.contrasena)
        if( ! isvalid) {
            return res.status(401).json({msg: 'Contraseña incorrecta'});
        }




    // Paso 4: Generar el Token (Tarjeta que presento que Autentica y Autoriza)
    const payload = {
        _id: userFound._id,
        nombre: userFound.nombre,
        apellido: userFound.apellido,
        email: userFound.email,
        rol: userFound.rol,
        status: userFound.status
    }
   const token = generateToken(payload)



    // Paso 5: Responder al cliente (Enviar el Token, IMPORTANTE: No devolver el password)
    const jsonObj = userFound.toObject();

    // Eliminar propiedades no deseadas
    delete jsonObj.contrasena;

    res.json({
        msg: 'Login de usuario', token: token, data: jsonObj
    });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo autenticar el usuario'})
        
    }
}


const verifyAuthenticate = ( req, res ) => {

    try {
    const userFound = req.userFound;

    const newPayload = {
        _id:userFound._id ,
        nombre: userFound.nombre ,
        apellido: userFound.apellido,
        email: userFound.email,
        rol: userFound.rol,
        status: userFound.status
    }
    const newToken = generateToken(newPayload);

    // Paso 3: Eliminar las propiedades sensiblesdel objeto retornado al usuario
    const jsOb =userFound.toObject();  // Convierte un BJSON en un objeto JavaScript
    delete jsOb.contrasena;            // Elimina el campo contrasena del Objeto que retornamos al usuario

   res.json({msg: 'Autenticidad de Token verficada con exito', token: newToken, data: jsOb})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'No se pudo autenticar el usuario'})
        
    }

}


export {
    loginUser,
    verifyAuthenticate
}