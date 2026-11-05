import SolicitudModel from "../models/solicitud.model.js";
import SolicitudImplementosModel from "../models/solicitudImplementos.model.js";
import ImplementoModel from "../models/implementos.model.js";
import ImplementoTallaModel from "../models/implementoTalla.model.js";
import ResenaModel from "../models/resena.model.js";
import { generarCodigo } from "../helpers/codigo.helpers.js";
import { errorHttp } from "../helpers/errores.helpers.js";

// Quién puede pasar una solicitud de qué estado a cuál
const TRANSICIONES = {
    Atleta: { Pendiente: ['Cancelado'], Aprobado: ['Entregado'] },
    Administrador: { Pendiente: ['Aprobado', 'Rechazado'], Aprobado: ['Entregado'] },
};

// Une ítems repetidos (mismo implemento/grupo/talla) porque hay índice único
const agruparItems = (items) => {
    const mapa = new Map();
    for (const it of items) {
        const cantidad = Number(it.cantidad ?? 1);
        if (!it.implemento || !it.grupo || !it.talla)
            throw errorHttp(400, 'Cada ítem requiere implemento, grupo y talla');
        if (!Number.isInteger(cantidad) || cantidad < 1)
            throw errorHttp(400, 'La cantidad debe ser un entero mayor a 0');

        const clave = `${it.implemento}|${it.grupo}|${it.talla}`;
        const previo = mapa.get(clave);
        mapa.set(clave, previo
            ? { ...previo, cantidad: previo.cantidad + cantidad }
            : { implemento: it.implemento, grupo: it.grupo, talla: String(it.talla), cantidad });
    }
    return [...mapa.values()];
};

const devolverStock = async (lineas) => {
    await Promise.all(lineas.map((l) =>
        ImplementoTallaModel.updateOne(
            { implemento: l.implemento, grupo: l.grupo, talla: l.talla },
            { $inc: { stock: l.cantidad } }
        )
    ));
};

// Lista con usuario (sin contraseña), ítems, total y si ya tiene reseña
const dbGetSolicitud = async (filtro = {}) => {
    const solicitudes = await SolicitudModel.find(filtro)
        .populate('usuario', 'nombre apellido')   // TODO(nivel del atleta): agregar el campo aquí cuando se realice el merge
        .sort({ fecha: -1 })
        .lean();

    const ids = solicitudes.map((s) => s._id);
    const [lineas, resenas] = await Promise.all([
        SolicitudImplementosModel.find({ solicitud: { $in: ids } }).populate('implemento', 'nombre imagen codigo').lean(),
        ResenaModel.find({ solicitud: { $in: ids } }).select('solicitud').lean(),
    ]);
    const conResena = new Set(resenas.map((r) => String(r.solicitud)));

    return solicitudes.map((s) => {
        const items = lineas.filter((l) => String(l.solicitud) === String(s._id));
        return {
            ...s,
            items,
            total: items.reduce((suma, l) => suma + l.cantidad * l.precioUnitario, 0),
            tieneResena: conResena.has(String(s._id)),
        };
    });
};

// datosPago: lo conecta el compañero de pagos
const dbCreateSolicitud = async (usuarioId, items = [], datosPago = null) => {
    if (!Array.isArray(items) || items.length === 0)
        throw errorHttp(400, 'La solicitud debe tener al menos un implemento');

    const lineas = agruparItems(items);
    const reservadas = [];

    try {
        for (const l of lineas) {
            const implemento = await ImplementoModel.findOne({ _id: l.implemento, estado: 'Disponible' });
            if (!implemento) throw errorHttp(404, 'El implemento no existe o no está disponible');

            // Descuento atómico: solo si hay stock suficiente
            const talla = await ImplementoTallaModel.findOneAndUpdate(
                { implemento: l.implemento, grupo: l.grupo, talla: l.talla, stock: { $gte: l.cantidad } },
                { $inc: { stock: -l.cantidad } }
            );
            if (!talla) throw errorHttp(409, `${implemento.nombre} talla ${l.talla}: sin stock suficiente o la talla no existe`);

            reservadas.push(l);
            l.precioUnitario = implemento.precio;   
        }

        // Pendiente(pagos): crear el pago con datosPago y asignar su _id en `pago`
        const solicitud = await SolicitudModel.create({
            codigo: await generarCodigo(SolicitudModel, 'SL'),
            usuario: usuarioId,
            // pago: pago._id PENDIENTE
        });

        try {
            await SolicitudImplementosModel.insertMany(
                lineas.map((l) => ({ ...l, solicitud: solicitud._id }))
            );
        } catch (error) {
            await SolicitudModel.deleteOne({ _id: solicitud._id });
            throw error;
        }

        return (await dbGetSolicitud({ _id: solicitud._id }))[0];
    } catch (error) {
        await devolverStock(reservadas);   // si algo falló, libera lo reservado
        throw error;
    }
};

const dbUpdateSolicitud = async (id, usuario, { condicion, motivoRechazo } = {}) => {
    const solicitud = await SolicitudModel.findById(id);
    if (!solicitud) return null;

    if (usuario.rol === 'Atleta' && String(solicitud.usuario) !== String(usuario._id))
        throw errorHttp(403, 'Esta solicitud no te pertenece');

    const permitidas = TRANSICIONES[usuario.rol]?.[solicitud.condicion] ?? [];
    if (!permitidas.includes(condicion))
        throw errorHttp(400, `No se puede pasar de ${solicitud.condicion} a ${condicion}`);

    if (condicion === 'Rechazado' && !motivoRechazo?.trim())
        throw errorHttp(400, 'El motivo del rechazo es obligatorio');

    const actualizada = await SolicitudModel.findOneAndUpdate(
        { _id: id, condicion: solicitud.condicion },
        { condicion, ...(condicion === 'Rechazado' ? { motivoRechazo: motivoRechazo.trim() } : {}) },
        { new: true, runValidators: true }
    );
    if (!actualizada) throw errorHttp(409, 'La solicitud cambió de estado, recarga e intenta de nuevo');

    if (condicion === 'Cancelado' || condicion === 'Rechazado') {
        await devolverStock(await SolicitudImplementosModel.find({ solicitud: id }));
    }

    return (await dbGetSolicitud({ _id: id }))[0];
};

const dbDeleteSolicitud = async (id) => {
    return await SolicitudModel.findOneAndDelete({ _id: id });
};

export {
    dbCreateSolicitud,
    dbGetSolicitud,
    dbDeleteSolicitud,
    dbUpdateSolicitud
};