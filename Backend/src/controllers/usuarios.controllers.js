import { dbCreateUsuario, dbGetUsuario, dbUpdateUsuario, dbFindUserByEmail, dbGenerarCodigo, PREFIJOS } from "../services/usuarios.services.js";
import { generarPassword } from "../helpers/bcrypt.helpers.js";

const responderError = (res, error, msg) => {
    console.error(error);

    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) errors[field] = error.errors[field].message;
        return res.status(400).json({ errors });
    }
    if (error.name === 'CastError') {
        return res.status(400).json({ msg: 'El ID no tiene un formato válido' });
    }
    res.status(500).json({ msg });
}

const esAdmin = (req) => req.userFound.rol === 'Administrador';

// Solo el propio usuario o un administrador
const esDuenoOAdmin = (req, idUsuario) =>
    esAdmin(req) || String(idUsuario) === String(req.userFound._id);

// Nunca devuelvee el hash
const sinContrasena = (doc) => {
    const obj = doc.toObject();
    delete obj.contrasena;
    return obj;
}

const getUsuario = async (req, res) => {
    try {
        if (!esDuenoOAdmin(req, req.params.id)) {
            return res.status(403).json({ msg: 'No tienes permiso sobre este usuario' });
        }

        const data = await dbGetUsuario(req.params.id);

        // Una cuenta inhabilitada solo la ve el admin
        if (!data || (!data.status && !esAdmin(req))) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json({ msg: 'Obtiene un usuario', data });
    }
    catch (error) {
        responderError(res, error, 'No se puede obtener el usuario por ID');
    }
}

// Creación por el administrador: nace aprobada, activa y con código
const createUsuario = async (req, res) => {
    try {
        const usuario = req.body;

        // El admin elige el rol, pero debe ser uno válido
        if (usuario.rol && !PREFIJOS[usuario.rol]) {
            return res.status(400).json({ errors: { rol: 'Rol no válido' } });
        }
        usuario.rol = usuario.rol || 'Atleta';

        usuario.createdBy = req.userFound._id;
        usuario.status = true;
        usuario.estadoSolicitud = 'Aprobada';
        delete usuario.codigo;
        delete usuario.resetCodeHash;
        delete usuario.resetCodeExpires;
        delete usuario.resetAttempts;

        if (!usuario.contrasena || usuario.contrasena.length < 8) {
            return res.status(400).json({ errors: { contrasena: 'La contraseña debe tener mínimo 8 caracteres' } });
        }

        // Sin filtrar por status: un correo de cuenta inhabilitada sigue ocupado
        if (usuario.email && await dbFindUserByEmail(usuario.email)) {
            return res.status(409).json({ errors: { email: 'Este correo ya está registrado' } });
        }

        usuario.contrasena = generarPassword(usuario.contrasena);
        usuario.codigo = await dbGenerarCodigo(usuario.rol);

        const nuevo = await dbCreateUsuario(usuario);

        res.status(201).json({ msg: 'Registra usuario', data: sinContrasena(nuevo) });
    }
    catch (error) {
        responderError(res, error, 'Error al registrar usuario');
    }
}

const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        if (!esDuenoOAdmin(req, id)) {
            return res.status(403).json({ msg: 'No tienes permiso sobre este usuario' });
        }

        const actual = await dbGetUsuario(id);
        if (!actual || (!actual.status && !esAdmin(req))) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        delete inputData.createdBy;
        delete inputData.resetCodeHash;
        delete inputData.resetCodeExpires;
        delete inputData.resetAttempts;
        delete inputData.codigo;
        delete inputData.estadoSolicitud;
        delete inputData.rol;
        delete inputData.status;

        // Nivel y mensualidad solo los asigna el admin
        if (!esAdmin(req)) {
            delete inputData.nivel;
            delete inputData.mensualidad;
        }

        // Correo: no puede quedar repetido
        if (inputData.email && inputData.email !== actual.email) {
            const existente = await dbFindUserByEmail(inputData.email);
            if (existente && String(existente._id) !== String(id)) {
                return res.status(409).json({ errors: { email: 'Este correo ya está registrado' } });
            }
        }

        // Contraseña: solo la cambia su dueño
        if (inputData.contrasena) {
            if (String(id) !== String(req.userFound._id)) {
                return res.status(403).json({ msg: 'Solo el dueño de la cuenta puede cambiar su contraseña' });
            }
            if (inputData.contrasena.length < 8) {
                return res.status(400).json({ errors: { contrasena: 'La contraseña debe tener mínimo 8 caracteres' } });
            }
            inputData.contrasena = generarPassword(inputData.contrasena);
        }

        const data = await dbUpdateUsuario(id, inputData);

        res.json({ msg: 'Usuario actualizado', data: sinContrasena(data) });
    }
    catch (error) {
        responderError(res, error, 'No se ha podido actualizar el usuario');
    }
}
export { getUsuario, createUsuario, updateUsuario }