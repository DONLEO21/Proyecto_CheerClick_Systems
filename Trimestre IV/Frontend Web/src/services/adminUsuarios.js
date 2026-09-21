import { supabase } from './supabase'

// Nombre (slug) de la Edge Function desplegada en Supabase.
// Si tu función se llama distinto (p. ej. 'swift-service'), cámbialo SOLO aquí.
const FUNCION = 'swift-service'

// Llama a la Edge Function (solo responde si quien llama es administrador)
export async function llamarAdmin(body) {
  const { data, error } = await supabase.functions.invoke(FUNCION, { body })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

// Lista de cuentas con ID legible por rol (AT001, EN001…) según orden de registro
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