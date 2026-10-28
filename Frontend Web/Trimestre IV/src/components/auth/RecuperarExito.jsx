function RecuperarExito({ irA }) {
  return (
    <div className="tarjeta">
      <img src="src/assets/icons/Logo-Club.png" alt="Éxito" className="icono-exito-img" />
      <h2 className="titulo-exito">¡Contraseña actualizada!</h2>
      <p className="subtitulo" style={{ marginBottom: '1.5rem' }}>
        Tu contraseña fue cambiada correctamente.<br />Ya puedes iniciar sesión con tu nueva clave.
      </p>
      <button className="boton-primario" type="button" onClick={() => irA('login')}>
        Ir al inicio de sesión
      </button>
    </div>
  )
}

export default RecuperarExito