import { useState } from 'react'
import { supabase } from '../../services/supabase'
import CampoClave from './CampoClave'

function Registro({ irA }) {
  const [rol, setRol] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const registrarUsuario = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!rol) return setMensaje('Selecciona un rol.')
    if (!nombre) return setMensaje('Ingresa tu nombre.')
    if (password.length < 6) return setMensaje('La contraseña debe tener mínimo 6 caracteres.')

    setCargando(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, rol },
      },
    })

    if (error) {
      setCargando(false)
      setMensaje(error.message)
      return
    }

    // CAMBIO: la cuenta NO entra al sistema hasta que el administrador la apruebe.
    // Si Supabase abrió sesión, se cierra, y se muestra la pantalla de cuenta pendiente.
    if (data.session) await supabase.auth.signOut()

    setCargando(false)
    irA('pendiente')
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Crear cuenta</h2>
      <p className="subtitulo">Complete su información</p>

      <form onSubmit={registrarUsuario}>
        <label className="etiqueta" htmlFor="registro-rol">Rol</label>
        <select className="campo" id="registro-rol" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="" disabled hidden>Seleccione su rol...</option>
          <option value="atleta">Atleta</option>
          <option value="entrenador">Entrenador</option>
        </select>

        <label className="etiqueta" htmlFor="registro-nombre">Nombre</label>
        <input
          className="campo"
          type="text"
          id="registro-nombre"
          placeholder="Gabriela Deoquiz"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="etiqueta" htmlFor="registro-correo">Correo electrónico</label>
        <input
          className="campo"
          type="email"
          id="registro-correo"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="etiqueta" htmlFor="registro-clave">Contraseña</label>
        <CampoClave
          id="registro-clave"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mensaje && <div className="mensaje-error">{mensaje}</div>}

        <button className="boton-primario" type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
        <p className="nota-pie">
          ¿Ya tienes cuenta? <a className="enlace-rojo" onClick={() => irA('login')}>Inicia sesión</a>
        </p>
      </form>
    </div>
  )
}
export default Registro