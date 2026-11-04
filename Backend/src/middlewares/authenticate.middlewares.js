import { generateToken, validateToken } from "../helpers/jwt.helpers.js";
import { dbGetUserByEmail } from "../services/usuarios.services.js";

const authMiddleware = async (req, res, next) => {
   const token = req.header('X-Token')

    const msg =  'hola soy el Middleware de Autenticaticon';

    console.log('token:', token);

    if ( ! token ) {
        res.status(401).json({msg: 'Cadena de token vacia'});
    }

    //Divide la cadena en partes usuando el (.) punto como referencia
     const tokenParts = token.split('.')
    //  console.log('Token Parts', tokenParts )

    // Verificar si la cadena tenga  parts separadas por puntos (Forma base de u token)
    if (tokenParts.length !== 3) {
        res.json({msg: 'EL formato del token no es valido'});
    } 

    const payload = validateToken(token);

    if ( ! payload) {
        res.json({msg: 'Token invalido o inactivo'});
    }

    console.log('payload (Middleware): ', payload);

    const userFound = await dbGetUserByEmail( payload.email );

    if ( !userFound) {
        res.json({msg: 'El usuario no esta Activo o el usuario no esta registrado en el sistema'})
    }

    req.userFound = userFound

    console.log('userFound', userFound);
    next();
}

export {
    authMiddleware
}