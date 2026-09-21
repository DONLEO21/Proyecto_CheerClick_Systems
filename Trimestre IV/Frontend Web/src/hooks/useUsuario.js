import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

// Devuelve los datos que el usuario escribió al registrarse
// (nombre y rol viven en user_metadata; el correo en user.email)
export default function useUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    rol: '',
    cargando: true,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUsuario({
        nombre: u?.user_metadata?.nombre ?? '',
        email: u?.email ?? '',
        rol: u?.user_metadata?.rol ?? '',
        cargando: false,
      })
    })
  }, [])

  return usuario
}