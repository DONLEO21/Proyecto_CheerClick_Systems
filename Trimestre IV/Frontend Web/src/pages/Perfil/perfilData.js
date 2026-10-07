import menuAtleta from '../../data/menuAtleta.js';
import menuAdmin from '../../data/menuAdmin.js';
import menuEntrenador from '../../data/menuEntrenador.js';

export const ETIQUETA_ROL = {
  atleta: 'Cuenta atleta',
  entrenador: 'Cuenta entrenador',
  admin: 'Cuenta administrador',
};

export const ETIQUETA_HEADER = {
  atleta: 'Atleta',
  entrenador: 'Entrenador',
  admin: 'Administrador',
};

export const MENUS = {
  atleta: menuAtleta,
  admin: menuAdmin,
  entrenador: menuEntrenador,
};

export const CAMPOS_UNA_VEZ = ['genero', 'fechaNacimiento', 'numeroDocumento'];

export const ETIQUETA_CAMPO = {
  genero: 'Género',
  fechaNacimiento: 'Fecha de nacimiento',
  numeroDocumento: 'Número de documento',
};

export const TIPOS_DOCUMENTO = [
  { value: 'cedula', label: 'Cédula de ciudadanía' },
  { value: 'tarjeta', label: 'Tarjeta de identidad' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'extranjeria', label: 'Cédula de extranjería' },
];

export const GENEROS = [
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'otro', label: 'Otro' },
  { value: 'no-decir', label: 'Prefiero no decirlo' },
];

export const EPS = [
  { value: 'compensar', label: 'Compensar' },
  { value: 'coomeva', label: 'Coomeva' },
  { value: 'famisanar', label: 'Famisanar' },
  { value: 'nuevaeps', label: 'Nueva EPS' },
  { value: 'salud-total', label: 'Salud Total' },
  { value: 'sanitas', label: 'Sanitas' },
  { value: 'sura', label: 'SURA' },
  { value: 'otra', label: 'Otra' },
];

export const PARENTESCOS = [
  { value: 'madre-padre', label: 'Madre / Padre' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'conyuge-pareja', label: 'Cónyuge / Pareja' },
  { value: 'otro', label: 'Otro' },
];

// Bucket público de Supabase Storage donde se guardan las fotos de perfil
export const BUCKET_AVATARES = 'avatars';
export const MAX_FOTO = 5 * 1024 * 1024; // 5MB
export const TIPOS_FOTO = ['image/jpeg', 'image/png'];

// Valores por defecto mientras carga el perfil real desde Supabase
export const DATOS_INICIALES = {
  fotoUrl: null,
  tipoDocumento: 'cedula',
  numeroDocumento: '',
  genero: '',
  fechaNacimiento: '',
  correo: '',
  telefono: '',
  eps: '',
  certificadoEpsNombre: '',
  certificadoEpsPath: '',
  certificadoEpsUrl: '',
  certificadoEpsArchivo: null,
  nivel: '',
  planMensualidad: '',
  contactos: [
    { nombre: '', apellido: '', telefono: '', parentesco: 'madre-padre' },
    { nombre: '', apellido: '', telefono: '', parentesco: 'madre-padre' },
  ],
};

export const BLOQUEOS_INICIALES = {
  genero: false,
  fechaNacimiento: false,
  numeroDocumento: false,
};

// Convierte la fila de la tabla `perfiles` (snake_case) al shape del formulario (camelCase)
export function perfilDesdeFila(fila, correoAuth) {
  return {
    fotoUrl: fila.foto_url ?? null,
    tipoDocumento: fila.tipo_documento ?? 'cedula',
    numeroDocumento: fila.numero_documento ?? '',
    genero: fila.genero ?? '',
    fechaNacimiento: fila.fecha_nacimiento ?? '',
    correo: correoAuth ?? '',
    telefono: fila.telefono ?? '',
    eps: fila.eps ?? '',
    certificadoEpsNombre: fila.certificado_eps_nombre ?? '',
    certificadoEpsPath: fila.certificado_eps_url ?? '', // en DB se guarda la ruta del archivo, no una URL pública
    certificadoEpsUrl: '',
    certificadoEpsArchivo: null,
    nivel: fila.nivel ?? '',
    planMensualidad: fila.plan_mensualidad ?? '',
    contactos: fila.contactos?.length ? fila.contactos : DATOS_INICIALES.contactos,
  };
}

export function iniciales(nombreCompleto) {
  return (nombreCompleto || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}