import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_MB = 5;
const CARPETA_FOTOS = path.resolve('uploads/fotos');
const CARPETA_CERTIFICADOS = path.resolve('uploads/certificados');

// Ruta absoluta del certificado en disco 
const rutaCertificado = ( nombre ) => path.join( CARPETA_CERTIFICADOS, path.basename( nombre ) );

// Tipo real según los primeros bytes del archivo 
const detectarTipo = ( buffer ) => {
    if( buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF ) return { ext: 'jpg' };
    if( buffer.length > 8 && buffer.subarray(0, 8).equals( Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) ) ) return { ext: 'png' };
    return null;
}

// Multer guarda el archivo en memoria para validarlo antes de escribirlo en disco
const subirFotoMiddleware = ( req, res, next ) => {
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 } }).single('foto');

    upload( req, res, ( error ) => {
        if( error?.code === 'LIMIT_FILE_SIZE' ) {
            return res.status(400).json({ msg: `La imagen no debe superar los ${MAX_MB} MB` });
        }
        if( error ) {
            return res.status(400).json({ msg: 'No se pudo leer el archivo. Envía el campo "foto"' });
        }
        next();
    });
}

// Valida y guarda la foto y devuelve la ruta pública 
const guardarFoto = async ( file ) => {
    if( ! file ) {
        throw Object.assign( new Error('Debes enviar una imagen en el campo "foto"'), { status: 400 } );
    }

    const tipo = detectarTipo( file.buffer );
    if( ! tipo ) {
        throw Object.assign( new Error('La imagen debe ser JPG o PNG'), { status: 400 } );
    }

    await fs.mkdir( CARPETA_FOTOS, { recursive: true } );

    const nombre = `${crypto.randomUUID()}.${tipo.ext}`;
    await fs.writeFile( path.join( CARPETA_FOTOS, nombre ), file.buffer );

    return `/uploads/fotos/${nombre}`;
}

// Borra la foto anterior (sin error si ya no existe)
const borrarFoto = async ( rutaPublica ) => {
    if( ! rutaPublica ) return;
    const archivo = path.basename( rutaPublica );     // basename evita salirse de la carpeta
    await fs.unlink( path.join( CARPETA_FOTOS, archivo ) ).catch( () => {} );
}

export { subirFotoMiddleware, guardarFoto, borrarFoto, rutaCertificado}