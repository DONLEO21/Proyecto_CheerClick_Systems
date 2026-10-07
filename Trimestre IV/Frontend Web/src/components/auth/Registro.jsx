import { useState } from 'react'
import { supabase } from '../../services/supabase'
import CampoClave from './CampoClave'

function Registro({ irA, setNombreRegistrado }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const registrarUsuario = async (e) => {
    e.preventDefault()
    setMensaje('')

    const nombreLimpio = nombre.trim()
    const apellidoLimpio = apellido.trim()

    if (!nombreLimpio) return setMensaje('Ingresa tu nombre.')
    if (!apellidoLimpio) return setMensaje('Ingresa tu apellido.')
    if (password.length < 6) return setMensaje('La contraseña debe tener mínimo 6 caracteres.')

    setCargando(true)

    // El rol ya no se envía: todo registro nace como "atleta" (lo asigna la base de datos).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre: nombreLimpio, apellido: apellidoLimpio },
      },
    })

    if (error) {
      setCargando(false)
      setMensaje(error.message)
      return
    }

    // La cuenta NO entra al sistema hasta que el administrador la apruebe.
    if (data.session) await supabase.auth.signOut()

    setCargando(false)
    setNombreRegistrado(nombreLimpio)
    irA('pendiente')
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Crear cuenta</h2>
      <p className="subtitulo">Complete su información</p>

      <form onSubmit={registrarUsuario}>
        <label className="etiqueta" htmlFor="registro-nombre">Nombre</label>
        <input
          className="campo"
          type="text"
          id="registro-nombre"
          placeholder="Gabriela"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="etiqueta" htmlFor="registro-apellido">Apellido</label>
        <input
          className="campo"
          type="text"
          id="registro-apellido"
          placeholder="Deoquiz"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
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