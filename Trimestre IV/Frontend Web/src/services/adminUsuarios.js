import { supabase } from './supabase'

const FUNCION = 'swift-service'

// Caché en memoria: al volver a la pantalla la lista aparece al instante
let cache = null
export const usuariosEnCache = () => cache

export async function llamarAdmin(body) {
  const { data, error } = await supabase.functions.invoke(FUNCION, { body })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

// Lectura directa de la tabla `cuentas` (rápida, sin Edge Function)
export async function cargarUsuarios() {
  const { data, error } = await supabase
    .from('cuentas')
    .select('id, email, nombre, apellido, rol, estado, activo, created_at')
    .eq('es_admin', false)
    .order('created_at', { ascending: true })

  if (error) throw error

  const contador = { atleta: 0, entrenador: 0 }
  cache = data.map((u) => {
    contador[u.rol] = (contador[u.rol] ?? 0) + 1
    const prefijo = u.rol === 'entrenador' ? 'EN' : 'AT'
    return {
      id: u.id,
      email: u.email,
      nombre: [u.nombre, u.apellido].filter(Boolean).join(' '),
      primerNombre: u.nombre,
      apellido: u.apellido,
      rol: u.rol,
      estado: u.estado,
      activo: u.activo,
      created_at: u.created_at,
      codigo: prefijo + String(contador[u.rol]).padStart(3, '0'),
    }
  })
  return cache
}

// Detalle completo (auth + tabla perfiles) para el modal del admin
export async function obtenerDetalleUsuario(id) {
  return llamarAdmin({ accion: 'detalle', id })
}