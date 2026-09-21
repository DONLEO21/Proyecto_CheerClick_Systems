import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const LOGIN = '/acceso?view=login'
const INICIO = {
  administrador: '/admin',
  entrenador: '/entrenador',
  atleta: '/atleta',
}

export default function Rutaprotegida({ rolPermitido, children }) {
  const [destino, setDestino] = useState(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let activo = true

    const validar = async () => {
      // getUser() consulta al servidor: trae app_metadata actualizado
      const { data, error } = await supabase.auth.getUser()
      if (!activo) return

      if (error || !data.user) {
        setOk(false)
        return setDestino(LOGIN)
      }

      const u = data.user
      const esAdmin = u.app_metadata?.rol_admin === true
      const estado = u.app_metadata?.estado ?? 'pendiente'
      const desactivada = u.app_metadata?.activo === false
      const rol = esAdmin ? 'administrador' : u.user_metadata?.rol

      if (!esAdmin && (estado !== 'aprobada' || desactivada)) {
        await supabase.auth.signOut()
        setOk(false)
        return setDestino(LOGIN)
      }

      if (rolPermitido && rol !== rolPermitido) {
        setOk(false)
        return setDestino(INICIO[rol] ?? LOGIN)
      }

      setOk(true)
    }

    validar()

    // Si la sesión cambia (cerrar sesión en esta u otra pestaña) //
    const { data: listener } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT') {
        setOk(false)
        setDestino(LOGIN)
      }
    })

    // restaurar pagina //
    const alMostrarPagina = (e) => {
      if (e.persisted) validar()
    }
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