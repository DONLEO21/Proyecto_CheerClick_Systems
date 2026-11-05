import { dbCreateImplemento, dbGetImplemento, dbUpdateImplemento } from "../services/implementos.services.js";
import { responderError } from "../helpers/errores.helpers.js";

// Solo estos campos se aceptan desde el body
const camposImplemento = (b) =>
    Object.fromEntries(
        Object.entries({
            nombre: b.nombre, categoria: b.categoria, estado: b.estado,
            precio: b.precio, imagen: b.imagen, genero: b.genero, tallas: b.tallas,
        }).filter(([, v]) => v !== undefined)
    );

const createImplemento = async (req, res) => {
    try {
        const data = await dbCreateImplemento({
            ...camposImplemento(req.body),
            createdBy: req.userFound._id,
        });
        res.status(201).json({ msg: 'Registrar implemento', data });
    } catch (error) {
        responderError(res, error, 'No se pudo registrar el implemento');
    }
};

const getImplemento = async (req, res) => {
    try {
        // El atleta solo ve lo que se puede pedir
        const filtro = req.userFound.rol === 'Atleta' ? { estado: 'Disponible' } : {};
        const data = await dbGetImplemento(filtro);
        res.status(200).json({ msg: 'Lista de implementos', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido listar implementos');
    }
};

const updateImplemento = async (req, res) => {
    try {
        const data = await dbUpdateImplemento(req.params.id, camposImplemento(req.body));
        if (!data) return res.status(404).json({ msg: 'No se encontró el implemento' });
        res.status(200).json({ msg: 'Actualizar implemento', data });
    } catch (error) {
        responderError(res, error, 'No se ha podido actualizar el implemento');
    }
};

export { createImplemento, getImplemento, updateImplemento };