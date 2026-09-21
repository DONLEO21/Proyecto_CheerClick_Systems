function CuentaPendiente({ irA }) {
  return (
    <div className="tarjeta tarjeta-pendiente">
      <div className="icono-advertencia">&#9888;</div>
      <h2 className="titulo-pendiente">Cuenta Pendiente<br />de Validación</h2>
      <p className="texto-pendiente">
        Gracias por registrarte en CheerClick Systems<br />
        Tu cuenta está en revisión por el Administrador
      </p>
      <div className="caja-info">
        <span className="icono-info">&#9432;</span>
        <p>Una vez que el Administrador valide tu cuenta, podrás iniciar sesión para acceder al sistema.</p>
      </div>
      <a className="enlace-rojo enlace-centrado" onClick={() => irA('login')}>Volver a Inicio</a>
    </div>
  )
}
export default CuentaPendiente