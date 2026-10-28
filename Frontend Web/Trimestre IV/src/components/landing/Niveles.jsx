const niveles = [
  ['INICIO', 'NIVEL FORMATIVO KING', 'El punto de partida ideal. Aprende las bases del cheerleading en un ambiente seguro', '../src/assets/img/entrenador.png', 'Jonathan Cruz', false],
  ['NIVEL 1', 'QUEENS', 'Desarrollo de habilidades fundamentales con enfoque en coordinación, técnico y trabajo en equipo', '../src/assets/img/entrenador.png', 'Ronald Linares', false],
  ['NIVEL 2', 'PRINCESS', 'Categoría nivel 2 con formación técnica sólida, expresión y disciplina como pilares centrales', '../src/assets/img/entrenador.png', 'Ronald Linares', false],
  ['NIVEL 3', 'MAGIC', 'Acrobacias avanzadas, stunts de nivel 3 y rutinas de alto impacto para competencia regional.', '../src/assets/img/entrenador.png', 'Stuard Reyes', false],
  ['NIVEL 4', 'BLOOD TIGERS', 'Nuestro equipo insignia. Atletas seleccionados que representan el club en competencias nacionales e internacionales.', '../src/assets/img/entrenador.png', 'Ronald Linares', true],
]

function Niveles() {
  return (
    <section id="niveles">
      <div className="contenedor">
        <div className="contenido-niveles">
          <div className="seccion-titulo">
            <h1>Nuestras Divisiones</h1>
          </div>
          <h2>5 NIVELES DE COMPETENCIA</h2>
          <p>Desde quienes dan sus primeros pasos hasta los atletas de alto rendimiento.<br />Hay un equipo Blood Tigers para cada etapa de tu camino</p>

          <div className="niveles-valores">
            {niveles.map(([etiqueta, nombre, descripcion, fotoEntrenador, entrenador, destacado]) => (
              <article
                className={`nivel-tarjetas${destacado ? ' nivel-destacado' : ''}`}
                key={nombre}
              >
                <header className="tarjeta-encabezado">
                  <h3>{etiqueta}</h3>
                  <h4>{nombre}</h4>
                  <p>{descripcion}</p>
                </header>
                <div className="nivel-entrenador">
                  <img src={fotoEntrenador} alt="Entrenador" />
                  <p>{entrenador}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Niveles