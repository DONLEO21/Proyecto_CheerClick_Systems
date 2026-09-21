import { useState } from 'react'

function RecuperarCorreo({ irA, setCorreo }) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const enviarCodigo = (e) => {
    e.preventDefault()
    setMensaje('')

    if (!email) return setMensaje('Ingresa tu correo electrónico.')
    if (!/\S+@\S+\.\S+/.test(email)) return setMensaje('Correo no válido.')

    setCorreo(email)
    setMensaje(`Código enviado a ${email}`)

    setTimeout(() => irA('recuperar-codigo'), 1000)
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Recuperar contraseña</h2>
      <p className="subtitulo">Ingresa tu correo y te enviaremos<br />un código de verificación</p>

      <div className="puntos-paso">
        <div className="punto-paso activo"></div>
        <div className="punto-paso"></div>
        <div className="punto-paso"></div>
      </div>

      <form onSubmit={enviarCodigo}>
        <label className="etiqueta" htmlFor="recuperar-correo">Correo electrónico</label>
        <input
          className="campo"
          type="email"
          id="recuperar-correo"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mensaje && (
          <div className={mensaje.startsWith('Código enviado') ? 'mensaje-exito' : 'mensaje-error'}>
            {mensaje}
          </div>
        )}

        <button className="boton-primario" type="submit">Enviar código</button>
        <button
          className="boton-secundario boton-bloque"
          type="button"
          style={{ marginTop: '8px' }}
          onClick={() => irA('login')}
        >
          &#8592; Volver al inicio
        </button>
      </form>
    </div>
  )
}

export default RecuperarCorreo