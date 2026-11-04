import { validateToken } from "../helpers/jwt.helpers.js";
import { dbGetUserByEmail } from "../services/usuarios.services.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('X-Token');

        if (!token) {
            return res.status(401).json({ msg: 'Cadena de token vacia' });
        }

        // Divide la cadena en partes usando el (.) punto como referencia
        const tokenParts = token.split('.');

        // Un token valido tiene 3 partes separadas por puntos
        if (tokenParts.length !== 3) {
            return res.status(401).json({ msg: 'El formato del token no es valido' });
        }

        const payload = validateToken(token);

        if (!payload) {
            return res.status(401).json({ msg: 'Token invalido o inactivo' });
        }

        const userFound = await dbGetUserByEmail(payload.email);

        if (!userFound) {
            return res.status(401).json({ msg: 'El usuario no esta Activo o el usuario no esta registrado en el sistema' });
        }

        // Guarda el usuario en la peticion para que lo usen los siguientes middlewares y controladores
        req.userFound = userFound;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al verificar la autenticacion' });
    }
}

export {
    authMiddleware
}