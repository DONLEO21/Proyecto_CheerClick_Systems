import fs from "fs";
import path from "path";
import { errorHttp } from "./errores.helpers.js";

const DESTINO = path.join(process.cwd(), 'uploads', 'justificaciones');
const EXTENSIONES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
const MAX_BYTES = 5 * 1024 * 1024;

// archivo: { nombre: 'soporte.pdf', contenido: 'data:application/pdf;base64,JVBERi0...' }
// Guarda el soporte en /uploads/justificaciones y devuelve sus datos (o null si no hay archivo)
export const guardarArchivoBase64 = async (archivo) => {
    if (!archivo) return null;

    const { nombre, contenido } = archivo;
    if (typeof nombre !== 'string' || typeof contenido !== 'string') {
        throw errorHttp(400, 'El archivo debe incluir nombre y contenido');
    }

    const extension = path.extname(nombre).toLowerCase();
    if (!EXTENSIONES.includes(extension)) {
        throw errorHttp(400, 'Formato no permitido. Use PDF, JPG, PNG, DOC o DOCX');
    }

    const base64 = contenido.includes(',') ? contenido.split(',')[1] : contenido;
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0) throw errorHttp(400, 'El archivo está vacío');
    if (buffer.length > MAX_BYTES) throw errorHttp(400, 'El archivo no puede superar los 5 MB');

    await fs.promises.mkdir(DESTINO, { recursive: true });
    const guardado = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const rutaFisica = path.join(DESTINO, guardado);
    await fs.promises.writeFile(rutaFisica, buffer);

    return {
        ruta: `/uploads/justificaciones/${guardado}`,
        nombre: path.basename(nombre),
        tamano: tamanoLegible(buffer.length),
        rutaFisica,
    };
};

// Si algo falla después de guardar, no deja archivos huérfanos
export const borrarArchivo = (archivo) => {
    if (archivo?.rutaFisica) fs.unlink(archivo.rutaFisica, () => {});
};