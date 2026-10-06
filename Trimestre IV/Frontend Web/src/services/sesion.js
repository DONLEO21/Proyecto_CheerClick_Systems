import { supabase } from './supabase'
import { limpiarCacheUsuario } from '../hooks/useUsuario'

// Bandera: indica que el cierre de sesión lo inició esta pestaña,

let cierreLocal = false
export const esCierreLocal = () => cierreLocal
export const reiniciarCierreLocal = () => { cierreLocal = false }

export async function cerrarSesion(navigate) {
  cierreLocal = true
  await supabase.auth.signOut()
  limpiarCacheUsuario()
  navigate('/', { replace: true })
  // Se reinicia después de que la navegación se aplique
  setTimeout(reiniciarCierreLocal, 0)
}