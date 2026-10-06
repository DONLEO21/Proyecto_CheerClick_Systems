import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function useUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    foto: null,
    cargando: true,
  })

  useEffect(() => {
    let vivo = true

    const cargar = async () => {
      const { data } = await supabase.auth.getUser()
      const u = data.user

      let foto = null
      if (u) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('foto_url')
          .eq('id', u.id)
          .maybeSingle()
        foto = perfil?.foto_url ?? null
      }
      
      if (!vivo) return
      setUsuario({
        nombre: u?.user_metadata?.nombre ?? '',
        apellido: u?.user_metadata?.apellido ?? '',
        email: u?.email ?? '',
        rol: u?.app_metadata?.rol_admin === true
          ? 'administrador'
          : (u?.app_metadata?.rol ?? 'atleta'),
        foto,
        cargando: false,
      })
    }

    cargar()
    return () => { vivo = false }
  }, [])

  return usuario
}