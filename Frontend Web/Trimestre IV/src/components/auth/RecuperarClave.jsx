import { useState } from 'react'
import CampoClave from './CampoClave'

function RecuperarClave({ irA }) {
  const [clave, setClave] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mensaje, setMensaje] = useState('')

  const guardarClave = (e) => {
    e.preventDefault()
    setMensaje('')

    if (!clave || clave.length < 6) return setMensaje('La contraseña debe tener mínimo 6 caracteres.')
    if (clave !== confirmar) return setMensaje('Las contraseñas no coinciden.')

    irA('recuperar-exito')
  }

  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Logo BTC" className="logo-imagen" />
      <h2>Nueva contraseña</h2>
      <p className="subtitulo">Crea una contraseña segura<br />para tu cuenta</p>

      <div className="puntos-paso">
        <div className="punto-paso completado"></div>
        <div className="punto-paso completado"></div>
        <div className="punto-paso activo"></div>
      </div>

      <form onSubmit={guardarClave}>
        <label className="etiqueta" htmlFor="clave-nueva">Nueva contraseña</label>
        <CampoClave
          id="clave-nueva"
          placeholder="Mínimo 6 caracteres"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <label className="etiqueta" htmlFor="confirmar-clave">Confirmar contraseña</label>
        <CampoClave
          id="confirmar-clave"
          placeholder="Repite la contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        {mensaje && <div className="mensaje-error">{mensaje}</div>}

        <button className="boton-primario" type="submit">Guardar contraseña</button>
        <button
          className="boton-secundario boton-bloque"
          type="button"
          style={{ marginTop: '8px' }}
          onClick={() => irA('recuperar-codigo')}
        >
          &#8592; Volver
        </button>
      </form>
    </div>
  )
}

export default RecuperarClave