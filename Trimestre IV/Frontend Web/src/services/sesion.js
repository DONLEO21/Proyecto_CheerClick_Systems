import { supabase } from './supabase'

// Úsalo en el botón "Cerrar Sesión" del Header:
//   onClick={() => cerrarSesion(navigate)}
export async function cerrarSesion(navigate) {
  await supabase.auth.signOut()
  navigate('/acceso?view=login', { replace: true })
}

export async function cerrarSesion(navigate) {
  console.log('cerrarSesion ejecutada')
  const { error } = await supabase.auth.signOut()
  console.log('signOut error:', error)
  navigate('/acceso?view=login', { replace: true })
}