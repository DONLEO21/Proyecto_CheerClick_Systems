
import { verifyPassword } from "../helpers/bcrypt.helpers.js";
import { dbGetUserByEmail } from "../services/usuarios.services.js";
import { generateToken } from "../helpers/jwt.helpers.js";

const loginUser = async ( req, res ) => {
    // Paso 1: Obtener las credenciales del usuario { email: '...', password: '...' }
    const inputData = req.body;

    // Valida si el campo email NO viene dentro de las inputData
    if( ! inputData.email ) {
        // Crea una Exception ---> Desarrollador
        // throw new Error( 'Se olvido pasar el correo en el campo email' );
        res.json({
            msg: 'Se olvido pasar el correo en el campo email'
        });
    }

    // Valida si el campo password NO viene dentro de las inputData
    if( ! inputData.contrasena ) {
        res.json({
            msg: 'Se olvido pasar la contraseña en el campo password'
        });
    }

    // Paso 2: Verificar si usuario existe ¿email esta registrado en la BD?
    const userFound = await dbGetUserByEmail( inputData.email );

    if( ! userFound ) {
        res.json({
            msg: 'El usuario no existe. Por favor registrese'
        });
    }

    // Paso 3: Verificar si la contraseña es valida
  const isvalid = verifyPassword(inputData.contrasena, userFound.contrasena)
  if( ! isvalid) {
    res.json({msg: 'Contraseña incorrecta'});
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
}


const verifyAuthenticate = ( req, res ) => {
     const data = req.holaatodos;
     console.log('::::', data)
    console.log('Soy el controlador de Autenticaction');
    res.json({
        msg: 'Verifica y actualiza las credenciales del usuario'
    });

    // const newPayload = {
    //     _id:userFound._id ,
    //     nombre: userFound.nombre ,
    //     apellido: userFound.apellido,
    //     email: userFound.email,
    //     rol: userFound.rol,
    //     status: userFound.status
    // }
    // const token = generateToken(newPayload);
}


export {
    loginUser,
    verifyAuthenticate
}