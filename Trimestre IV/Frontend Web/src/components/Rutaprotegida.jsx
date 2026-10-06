import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const LOGIN = '/acceso?view=login'
const INICIO = {
  administrador: '/admin',
  entrenador: '/entrenador',
  atleta: '/atleta',
}

// Devuelve a dónde redirigir, o null si el usuario puede entrar
function evaluar(u, rolPermitido) {
  if (!u) return LOGIN
  const esAdmin = u.app_metadata?.rol_admin === true
  const estado = u.app_metadata?.estado ?? 'pendiente'
  const desactivada = u.app_metadata?.activo === false
  const rol = esAdmin ? 'administrador' : (u.app_metadata?.rol ?? 'atleta')

  if (!esAdmin && (estado !== 'aprobada' || desactivada)) return LOGIN
  if (rolPermitido && rol !== rolPermitido) return INICIO[rol] ?? LOGIN
  return null
}

export default function Rutaprotegida({ rolPermitido, children }) {
  const [destino, setDestino] = useState(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let activo = true

    const aplicar = async (u) => {
      const dest = evaluar(u, rolPermitido)
      if (dest === LOGIN && u) await supabase.auth.signOut()
      if (!activo) return
      if (dest) { setOk(false); setDestino(dest) } else { setDestino(null); setOk(true) }
    }

    const validar = async () => {
      // 1) Sesión local (sin red): la pantalla aparece al instante
      const { data: { session } } = await supabase.auth.getSession()
      if (!activo) return
      if (!session) { setOk(false); return setDestino(LOGIN) }
      if (!evaluar(session.user, rolPermitido)) setOk(true)

      // 2) Confirmación con el servidor en segundo plano
      //    (detecta cuentas desactivadas o cambios de rol recientes)
      const { data, error } = await supabase.auth.getUser()
      if (!activo) return
      if (error || !data.user) { setOk(false); return setDestino(LOGIN) }
      await aplicar(data.user)
    }

    validar()

    // Si la sesión cambia (cerrar sesión en esta u otra pestaña)
    const { data: listener } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT') { setOk(false); setDestino(LOGIN) }
    })

    // Restaurar página desde el caché de ida/vuelta del navegador
    const alMostrarPagina = (e) => { if (e.persisted) validar() }
    window.addEventListener('pageshow', alMostrarPagina)

    return () => {
      activo = false
      listener.subscription.unsubscribe()
      window.removeEventListener('pageshow', alMostrarPagina)
    }
  }, [rolPermitido])

  if (destino) return <Navigate to={destino} replace />
  if (ok) return children
  return <div>Cargando...</div>
}