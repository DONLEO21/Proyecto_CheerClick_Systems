import { validateToken } from "../helpers/jwt.helpers.js";
import { dbGetUsuario } from "../services/usuarios.services.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('X-Token');

        if ( ! token ) {
            return res.status(401).json({msg: 'Cadena de token vacia'});
        }

        // Divide la cadena en partes usando el (.) punto como referencia
        const tokenParts = token.split('.');

        // Un token valido tiene 3 partes separadas por puntos
        if (tokenParts.length !== 3) {
            return res.status(401).json({msg: 'EL formato del token no es valido'});
        }

        const payload = validateToken(token);

        if ( ! payload) {
            return res.status(401).json({msg: 'Token invalido o inactivo'});
        }

        // Se busca por _id: el correo puede cambiar, el _id nunca
        const userFound = await dbGetUsuario( payload._id );

        if ( ! userFound || ! userFound.status ) {
            return res.status(401).json({msg: 'El usuario no esta activo o el usuario no esta registrado en el sistema'});
        }

        req.userFound = userFound;
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({msg: 'Token invalido o inactivo'});
    }
}

export {
    authMiddleware
}