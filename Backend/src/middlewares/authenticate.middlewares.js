import { generateToken, validateToken } from "../helpers/jwt.helpers.js";
import { dbGetUserByEmail } from "../services/usuarios.services.js";

const authMiddleware = async (req, res, next) => {
    const token = req.header('X-Token');

    if (!token) {
        return res.status(401).json({ msg: 'Cadena de token vacia' });
    }

    // Un JWT tiene 3 partes separadas por punto
    if (token.split('.').length !== 3) {
        return res.status(401).json({ msg: 'El formato del token no es valido' });
    }

    const payload = validateToken(token);

    if (!payload) {
        return res.status(401).json({ msg: 'Token invalido o expirado' });
    }

    const userFound = await dbGetUserByEmail(payload.email);

    if (!userFound) {
        return res.status(401).json({ msg: 'El usuario no esta activo o no esta registrado en el sistema' });
    }

    req.userFound = userFound;
    next();
};

export {
    authMiddleware
}