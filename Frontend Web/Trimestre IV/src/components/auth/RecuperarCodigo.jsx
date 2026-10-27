import { useState, useRef } from 'react'

function RecuperarCodigo({ irA, correo }) {
  const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const inputsRef = useRef([])

  const cambiarDigito = (index, valor) => {
    if (valor.length > 1) return
    const nuevoCodigo = [...codigo]
    nuevoCodigo[index] = valor
    setCodigo(nuevoCodigo)

    if (valor && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const manejarBackspace = (index, e) => {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const reenviarCodigo = () => {
    setCodigo(['', '', '', '', '', ''])
    setTipoMensaje('exito')
    setMensaje('Código reenviado')
    inputsRef.current[0]?.focus()
  }

  const verificarCodigo = (e) => {
    e.preventDefault()
    const ingresado = codigo.join('')

    if (ingresado.length < 6) {
      setTipoMensaje('error')
      setMensaje('Ingresa los 6 dígitos del código.')
      return
    }

    setTipoMensaje('exito')
    setMensaje('¡Código correcto!')
    setTimeout(() => irA('recuperar-clave'), 800)
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Verificar código</h2>
      <p className="subtitulo">Ingresa el código de 6 dígitos<br />enviado a {correo || 'tu correo'}</p>

      <div className="puntos-paso">
        <div className="punto-paso completado"></div>
        <div className="punto-paso activo"></div>
        <div className="punto-paso"></div>
      </div>

      <form onSubmit={verificarCodigo}>
        <div className="codigo-entradas">
          {codigo.map((digito, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              className="codigo-entrada"
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digito}
              onChange={(e) => cambiarDigito(index, e.target.value)}
              onKeyDown={(e) => manejarBackspace(index, e)}
            />
          ))}
        </div>

        {mensaje && (
          <div className={tipoMensaje === 'error' ? 'mensaje-error' : 'mensaje-exito'}>
            {mensaje}
          </div>
        )}

        <button className="boton-primario" type="submit">Verificar código</button>
        <p className="nota-pie" style={{ marginTop: '10px' }}>
          ¿No llegó? <a className="enlace-rojo" onClick={reenviarCodigo}>Reenviar código</a>
        </p>
        <button
          className="boton-secundario boton-bloque"
          type="button"
          style={{ marginTop: '6px' }}
          onClick={() => irA('recuperar-correo')}
        >
          &#8592; Volver
        </button>
      </form>
    </div>
  )
}

export default RecuperarCodigo