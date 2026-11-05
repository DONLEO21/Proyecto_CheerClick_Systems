import ImplementoModel from "../models/implementos.model.js";
import ImplementoTallaModel from "../models/implementoTalla.model.js";
import SolicitudImplementosModel from "../models/solicitudImplementos.model.js";
import ResenaModel from "../models/resena.model.js";
import { GRUPOS_POR_CATEGORIA, TALLAS_POR_GRUPO } from "../constants/tallas.js";
import { generarCodigo } from "../helpers/codigo.helpers.js";
import { errorValidacion } from "../helpers/errores.helpers.js";

// Lista implementos con tallas, cantidad total, calificación promedio y # de reseñas
const dbGetImplemento = async (filtro = {}) => {
    return await ImplementoModel.aggregate([
        { $match: filtro },
        { $lookup: { from: ImplementoTallaModel.collection.name, localField: '_id', foreignField: 'implemento', as: 'tallas' } },
        { $lookup: { from: SolicitudImplementosModel.collection.name, localField: '_id', foreignField: 'implemento', as: 'lineas' } },
        { $lookup: { from: ResenaModel.collection.name, localField: 'lineas.solicitud', foreignField: 'solicitud', as: 'resenasDocs' } },
        {
            $addFields: {
                cantidad: { $sum: '$tallas.stock' },
                resenas: { $size: '$resenasDocs' },
                calificacion: { $ifNull: [{ $avg: '$resenasDocs.estrella' }, 0] },
            }
        },
        { $project: { lineas: 0, resenasDocs: 0 } },
        { $sort: { createdAt: -1 } },
    ]);
};

// Valida y deja las tallas del implemento exactamente como llegan (crea, actualiza y borra)
const dbSincronizarTallas = async (implementoId, tallas = []) => {
    const implemento = await ImplementoModel.findById(implementoId);
    if (!implemento) throw errorValidacion('implemento', 'El implemento no existe');

    const permitidos = GRUPOS_POR_CATEGORIA[implemento.categoria] ?? [];
    for (const t of tallas) {
        if (!permitidos.includes(t.grupo))
            throw errorValidacion('grupo', `Para ${implemento.categoria} el grupo debe ser: ${permitidos.join(', ')}`);
        if (!(TALLAS_POR_GRUPO[t.grupo] ?? []).includes(String(t.talla)))
            throw errorValidacion('talla', `La talla ${t.talla} no corresponde al grupo ${t.grupo}`);
        if (!Number.isInteger(Number(t.stock)) || Number(t.stock) < 0)
            throw errorValidacion('stock', 'El stock debe ser un entero mayor o igual a 0');
    }

    // Borra las tallas que ya no vienen en la lista
    await ImplementoTallaModel.deleteMany(
        tallas.length === 0
            ? { implemento: implementoId }
            : { implemento: implementoId, $nor: tallas.map((t) => ({ grupo: t.grupo, talla: String(t.talla) })) }
    );

    if (tallas.length > 0) {
        await ImplementoTallaModel.bulkWrite(
            tallas.map((t) => ({
                updateOne: {
                    filter: { implemento: implementoId, grupo: t.grupo, talla: String(t.talla) },
                    update: { $set: { stock: Number(t.stock) } },
                    upsert: true,
                },
            }))
        );
    }
};

const dbCreateImplemento = async ({ tallas = [], ...datos }) => {
    datos.codigo = await generarCodigo(ImplementoModel, 'IM');
    const implemento = await ImplementoModel.create(datos);

    try {
        await dbSincronizarTallas(implemento._id, tallas);
    } catch (error) {
        await ImplementoModel.deleteOne({ _id: implemento._id }); 
        throw error;
    }
    return (await dbGetImplemento({ _id: implemento._id }))[0];
};

const dbUpdateImplemento = async (id, { tallas, ...datos }) => {
    const actualizado = await ImplementoModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    if (!actualizado) return null;

    if (Array.isArray(tallas)) await dbSincronizarTallas(actualizado._id, tallas);

    return (await dbGetImplemento({ _id: actualizado._id }))[0];
};

const dbDeleteImplemento = async (id) => {
    return await ImplementoModel.findOneAndDelete({ _id: id });
};

export {
    dbCreateImplemento,
    dbGetImplemento,
    dbDeleteImplemento,
    dbUpdateImplemento
};