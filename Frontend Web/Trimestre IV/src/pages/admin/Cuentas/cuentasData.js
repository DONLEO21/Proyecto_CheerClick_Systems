export const FILAS_POR_PAGINA = 5
export const TABS = { pendiente: 'Pendientes', aprobada: 'Aprobadas', rechazada: 'Rechazadas' }
export const BADGE_ESTADO = { pendiente: 'amarillo', aprobada: 'verde', rechazada: 'rojo' }
export const NOMBRE_ROL = { atleta: 'Atleta', entrenador: 'Entrenador' }
export const ROLES = ['atleta', 'entrenador'] // el primero es el rol por defecto

export const NOMBRE_GENERO = {
  femenino: 'Femenino', masculino: 'Masculino', otro: 'Otro', 'no-decir': 'Prefiere no decirlo',
}
export const NOMBRE_TIPO_DOC = {
  cedula: 'Cédula de ciudadanía', tarjeta: 'Tarjeta de identidad',
  pasaporte: 'Pasaporte', extranjeria: 'Cédula de extranjería',
}
export const NOMBRE_EPS = {
  compensar: 'Compensar', coomeva: 'Coomeva', famisanar: 'Famisanar',
  nuevaeps: 'Nueva EPS', 'salud-total': 'Salud Total', sanitas: 'Sanitas',
  sura: 'SURA', otra: 'Otra',
}
const NOMBRE_PARENTESCO = {
  'madre-padre': 'Madre / Padre',
  tutor: 'Tutor',
  'conyuge-pareja': 'Cónyuge / Pareja',
  otro: 'Otro',
}

export const ACCIONES = {
  aprobar: {
    titulo: '¿Aprobar solicitud?',
    desc: (n) => `${n} podrá iniciar sesión en el sistema. ¿Confirmas la aprobación?`,
    boton: 'Sí, aprobar', clase: 'btn-verde',
    exito: 'Solicitud aprobada', tipo: 'ok',
  },
  rechazar: {
    titulo: '¿Rechazar solicitud?',
    desc: (n) => `La solicitud de ${n} será rechazada. ¿Confirmas el rechazo?`,
    boton: 'Sí, rechazar', clase: 'btn-primario',
    exito: 'Solicitud rechazada', tipo: 'error',
  },
  activar: {
    titulo: '¿Activar cuenta?',
    desc: () => 'El usuario podrá volver a ingresar al sistema. ¿Confirmas la activación?',
    boton: 'Sí, activar', clase: 'btn-verde',
    exito: 'Cuenta activada', tipo: 'ok',
  },
  desactivar: {
    titulo: '¿Desactivar cuenta?',
    desc: () => 'El usuario perderá acceso al sistema hasta ser reactivado. ¿Confirmas la desactivación?',
    boton: 'Sí, desactivar', clase: 'btn-primario',
    exito: 'Cuenta desactivada', tipo: 'advertencia',
  },
  'cambiar-rol': {
    titulo: '¿Cambiar rol?',
    desc: (n, rol) => `${n} pasará a ser ${NOMBRE_ROL[rol]}. ¿Confirmas el cambio de rol?`,
    boton: 'Sí, cambiar rol', clase: 'btn-verde',
    exito: 'Rol actualizado', tipo: 'ok',
  },
}

/* ───────── formato ───────── */
export const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO')

// Placeholder para campos de solo lectura vacíos o nulos
export const val = (v) => (v === null || v === undefined || v === '' ? '—' : v)

export const fechaVal = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return val(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const parentescoLegible = (clave) => {
  if (!clave) return null
  if (NOMBRE_PARENTESCO[clave]) return NOMBRE_PARENTESCO[clave]
  return clave
    .split('-')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' / ')
}

/* ───────── listas ───────── */
export const coincide = (u, busqueda) =>
  `${u.nombre} ${u.email}`.toLowerCase().includes(busqueda.toLowerCase())

export const paginar = (lista, pagina) => {
  const total = lista.length
  const totalPaginas = Math.max(1, Math.ceil(total / FILAS_POR_PAGINA))
  const actual = Math.min(pagina, totalPaginas)
  const inicio = (actual - 1) * FILAS_POR_PAGINA
  return { visibles: lista.slice(inicio, inicio + FILAS_POR_PAGINA), actual, totalPaginas, total, inicio }
}