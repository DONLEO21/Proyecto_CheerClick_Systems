import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_MB = 5;
const CARPETA_FOTOS = path.resolve('uploads/fotos');
const CARPETA_CERTIFICADOS = path.resolve('uploads/certificados');

const PNG = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

// Tipo real según los primeros bytes 
const detectarTipo = ( buffer, permitirPdf = false ) => {
    if( buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF ) return { ext: 'jpg' };
    if( buffer.length > 8 && buffer.subarray(0, 8).equals( PNG ) ) return { ext: 'png' };
    if( permitirPdf && buffer.length > 4 && buffer.subarray(0, 4).toString('latin1') === '%PDF' ) return { ext: 'pdf' };
    return null;
}

// Multer guarda en memoria para validar el contenido antes de escribir en disco
const crearMiddleware = ( campo ) => ( req, res, next ) => {
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 } }).single( campo );

    upload( req, res, ( error ) => {
        if( error?.code === 'LIMIT_FILE_SIZE' ) {
            return res.status(400).json({ msg: `El archivo no debe superar los ${MAX_MB} MB` });
        }
        if( error ) {
            return res.status(400).json({ msg: `No se pudo leer el archivo. Envía el campo "${campo}"` });
        }
        next();
    });
}

const subirFotoMiddleware = crearMiddleware('foto');
const subirCertificadoMiddleware = crearMiddleware('certificado');

const errorValidacion = ( msg ) => Object.assign( new Error( msg ), { status: 400 } );

const guardar = async ( file, carpeta, permitirPdf, msgFormato ) => {
    const tipo = detectarTipo( file.buffer, permitirPdf );
    if( ! tipo ) throw errorValidacion( msgFormato );

    await fs.mkdir( carpeta, { recursive: true } );

    const nombre = `${crypto.randomUUID()}.${tipo.ext}`;
    await fs.writeFile( path.join( carpeta, nombre ), file.buffer );
    return nombre;
}

// Foto: devuelve la ruta pública
const guardarFoto = async ( file ) => {
    if( ! file ) throw errorValidacion('Debes enviar una imagen en el campo "foto"');
    const nombre = await guardar( file, CARPETA_FOTOS, false, 'La imagen debe ser JPG o PNG' );
    return `/uploads/fotos/${nombre}`;
}

// Certificado: devuelve solo el nombre del archivo
const guardarCertificado = async ( file ) => {
    if( ! file ) throw errorValidacion('Debes enviar el archivo en el campo "certificado"');
    return await guardar( file, CARPETA_CERTIFICADOS, true, 'El certificado debe ser PDF, JPG o PNG' );
}

const borrarFoto = async ( rutaPublica ) => {
    if( ! rutaPublica ) return;
    await fs.unlink( path.join( CARPETA_FOTOS, path.basename( rutaPublica ) ) ).catch( () => {} );
}

const borrarCertificado = async ( nombre ) => {
    if( ! nombre ) return;
    await fs.unlink( path.join( CARPETA_CERTIFICADOS, path.basename( nombre ) ) ).catch( () => {} );
}

// Ruta absoluta del certificado 
const rutaCertificado = ( nombre ) => path.join( CARPETA_CERTIFICADOS, path.basename( nombre ) );

export {
    subirFotoMiddleware, subirCertificadoMiddleware,
    guardarFoto, guardarCertificado,
    borrarFoto, borrarCertificado,
    rutaCertificado
}