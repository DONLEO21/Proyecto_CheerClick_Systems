import { Link } from "react-router-dom";
function Hero() {
  return (
    <section id="hero">
      <div className="contenedor hero-layout">
        <div className="hero-contenido">
          <h1>
            <span className="hero-titulo-club">CLUB DEPORTIVO</span>
            <span className="hero-titulo-nombre">BLOOD TIGERS CHEER</span>
          </h1>

          <p>
            Supera tus límites. Vive el cheerleading. En Blood Tigers Cheer
            entrenas, compites y creces no solo como deportista, sino como
            persona integral, en un entorno que impulsa tu disciplina y
            confianza.
          </p>

          <div className="hero-botones">
            <Link to="/acceso?view=registro" className="btn btn-primario">
              Registrarse
            </Link>
            <Link to="/acceso" className="btn btn-secundario">
              Iniciar sesión
            </Link>
          </div>

          <div className="logros">
            <div>
              <h2>5+</h2>
              <p>Años de experiencia</p>
            </div>
            <div>
              <h2>5</h2>
              <p>Niveles de competencia</p>
            </div>
            <div>
              <h2>10+</h2>
              <p>Títulos ganados</p>
            </div>
          </div>
        </div>

        <div className="hero-imagen">
          <img
            src="../src/assets/img/equipo-blood-tigers.jpg"
            alt="Equipo Blood Tigers Cheer"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
