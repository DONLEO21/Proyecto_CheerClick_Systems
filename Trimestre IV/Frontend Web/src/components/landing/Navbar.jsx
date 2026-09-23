import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg nav-publica fixed-top">
        <div className="container-fluid nav-publica-contenedor">

          {/* logo con imagen y texto en dos líneas */}
          <a className="navbar-brand logo" href="#hero">
            <img src="src/assets/icons/Logo-Club.png" alt="Logo" />
            <div className="logo-texto">
              <span className="logo-club">CLUB DEPORTIVO</span>
              <span className="logo-nombre">BLOOD TIGERS CHEER</span>
            </div>
          </a>

          {/* botón hamburguesa para móvil */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

              <li className="nav-item">
                <a className="nav-link" href="#hero">Home</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#nosotros">Nosotros</a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Programas
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#servicios">Servicios</a></li>
                  <li><a className="dropdown-item" href="#niveles">Niveles</a></li>
                  <li><a className="dropdown-item" href="#horarios">Horarios</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#footer">Contacto</a>
              </li>

              {/* botón de iniciar sesión separado visualmente */}
              <li className="nav-item ms-lg-3">
                <Link className="nav-link btn-nav-sesion" to="/acceso">
                  Iniciar sesión
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;