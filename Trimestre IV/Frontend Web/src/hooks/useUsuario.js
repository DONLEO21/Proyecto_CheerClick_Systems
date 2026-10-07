import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

// Caché en memoria: evita repetir consultas al navegar entre pantallas
let cache = null

export const limpiarCacheUsuario = () => { cache = null }

supabase.auth.onAuthStateChange((evento) => {
  if (evento === 'SIGNED_OUT') cache = null
})

const VACIO = {
  nombre: '',
  apellido: '',
  email: '',
  rol: '',
  foto: null,
  cargando: true,
}

export default function useUsuario() {
  const [usuario, setUsuario] = useState(() => cache ?? VACIO)

  useEffect(() => {
    let vivo = true

    const cargar = async () => {
      // getSession() es local (sin red). La validez de la sesión ya la comprueba Rutaprotegida.
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user

      if (!u) {
        if (vivo) setUsuario({ ...VACIO, cargando: false })
        return
      }

      // Datos básicos al instante //
      const base = {
        nombre: u.user_metadata?.nombre ?? '',
        apellido: u.user_metadata?.apellido ?? '',
        email: u.email ?? '',
        rol: u.app_metadata?.rol_admin === true
          ? 'administrador'
          : (u.app_metadata?.rol ?? 'atleta'),
      }
      if (vivo) setUsuario((prev) => ({ ...prev, ...base, cargando: false }))

      // La foto llega después, sin bloquear la pantalla
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('foto_url')
        .eq('id', u.id)
        .maybeSingle()

      const final = { ...base, foto: perfil?.foto_url ?? null, cargando: false }
      cache = final
      if (vivo) setUsuario(final)
    }

    cargar()
    return () => { vivo = false }
  }, [])

  return usuario
}