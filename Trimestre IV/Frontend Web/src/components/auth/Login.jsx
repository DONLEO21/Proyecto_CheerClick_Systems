import { useState } from 'react'
import { supabase } from '../../services/supabase'
import CampoClave from './CampoClave'

/* Iconos de la alerta (SVG en línea, sin dependencias) */
const IconoAdvertencia = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconoError = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

function Login({ irA }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  // alerta en línea: { tipo: 'advertencia' | 'error', titulo, texto } | null
  const [alerta, setAlerta] = useState(null)

  const iniciarSesion = async (e) => {
    e.preventDefault()
    setAlerta(null)
    setCargando(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setCargando(false)

    if (error) {
      return setAlerta({
        tipo: 'error',
        titulo: 'Error:',
        texto: error.message.toLowerCase().includes('confirm')
          ? 'Debes confirmar tu correo antes de iniciar sesión.'
          : 'Correo o contraseña incorrectos.',
      })
    }

    const u = data.user
    const esAdmin = u.app_metadata?.rol_admin === true
    const estado = u.app_metadata?.estado ?? 'pendiente' // solo el servidor puede escribirlo
    const rol = u.user_metadata?.rol

    if (!esAdmin) {
      if (estado === 'pendiente') {
        await supabase.auth.signOut()
        return setAlerta({
          tipo: 'advertencia',
          titulo: 'Atención:',
          texto: 'Tu cuenta está en proceso de revisión.\nTe notificaremos por correo cuando sea aprobada.',
        })
      }
      if (estado === 'rechazada') {
        await supabase.auth.signOut()
        return setAlerta({
          tipo: 'error',
          titulo: 'Error:',
          texto: 'Tu solicitud no fue aprobada. Contacta al club.',
        })
      }
      if (u.app_metadata?.activo === false) {
        await supabase.auth.signOut()
        return setAlerta({
          tipo: 'error',
          titulo: 'Error:',
          texto: 'Tu cuenta está desactivada. Contacta al club.',
        })
      }
    }

    // Aprobada → dashboard (rutas reales de App.jsx)
    if (esAdmin) window.location.href = '/admin'
    else if (rol === 'entrenador') window.location.href = '/entrenador'
    else window.location.href = '/atleta'
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Iniciar sesión</h2>

      {alerta && (
        <div
          className={`alerta alerta-${alerta.tipo}`}
          role={alerta.tipo === 'error' ? 'alert' : 'status'}
        >
          <span className="alerta-icono">
            {alerta.tipo === 'error' ? <IconoError /> : <IconoAdvertencia />}
          </span>
          <p className="alerta-texto">
            <strong>{alerta.titulo}</strong> {alerta.texto}
          </p>
        </div>
      )}

      <form onSubmit={iniciarSesion}>
        <label className="etiqueta" htmlFor="login-correo">Correo electrónico</label>
        <input
          className="campo"
          type="email"
          id="login-correo"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="etiqueta" htmlFor="login-clave">Contraseña</label>
        <CampoClave
          id="login-clave"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="boton-primario" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="nota-pie">
          <a className="enlace-rojo" onClick={() => irA('recuperar-correo')}>¿Olvidaste tu contraseña?</a>
        </p>
        <p className="nota-pie">
          ¿No tienes cuenta? <a className="enlace-rojo" onClick={() => irA('registro')}>Regístrate</a>
        </p>
      </form>
    </div>
  )
}
export default Login