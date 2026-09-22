import { supabase } from './supabase'

const FUNCION = 'swift-service'

export async function llamarAdmin(body) {
  const { data, error } = await supabase.functions.invoke(FUNCION, { body })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export async function cargarUsuarios() {
  const { usuarios } = await llamarAdmin({ accion: 'listar' })
  const contador = { atleta: 0, entrenador: 0 }
  return [...usuarios]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((u) => {
      contador[u.rol] = (contador[u.rol] ?? 0) + 1
      const prefijo = u.rol === 'entrenador' ? 'EN' : 'AT'
      return { ...u, codigo: prefijo + String(contador[u.rol]).padStart(3, '0') }
    })
}

// NUEVO: detalle completo (auth + tabla perfiles) de un usuario, para el modal del admin
export async function obtenerDetalleUsuario(id) {
  return llamarAdmin({ accion: 'detalle', id })
}