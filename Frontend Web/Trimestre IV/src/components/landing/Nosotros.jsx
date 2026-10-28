const valores = [
  ['../src/assets/img/objetivo.svg', 'Entrenamiento de Élite', 'Metodología profesional adaptada a cada nivel desde formativo hasta competencia nacional.'],
  ['../src/assets/img/manos.svg', 'Trabajo en Equipo', 'Fomentamos respeto, compañerismo y liderazgo dentro y fuera de la pista.'],
  ['../src/assets/img/podio.svg', 'Competencia de Alto Nivel', 'Participamos en torneos regionales y nacionales con rutinas de nivel internacional.'],
  ['../src/assets/img/fuerte.svg', 'Desarrollo Integral', 'Formamos atletas seguros, disciplinados y comprometidos con sus metas.'],
]

function Nosotros() {
  return (
    <section id="nosotros">
      <div className="contenedor">
        <div className="seccion-titulo">
          <h1>¿QUIÉNES SOMOS?</h1>
        </div>

        <div className="nosotros-layout">
          <div className="nosotros-info">
            <h2>MÁS QUE UN CLUB,<br />UNA FAMILIA</h2>
            <p>Blood Tigers Cheer es un club deportivo comprometido con el desarrollo integral de cada atleta, combinando disciplina, trabajo en equipo y pasión por el cheerleading.</p>

            <div className="nosotros-imagen">
              <img src="../src/assets/img/blood-tigers-competencia.jpg" alt="Equipo Blood Tigers Cheer" />
              <div className="historia-tarjeta">
                <h3>5+</h3>
                <p>Años de Historia</p>
              </div>
            </div>
          </div>

          <div className="nosotros-valores">
            {valores.map(([icono, titulo, texto]) => (
              <article className="valor-tarjetas" key={titulo}>
                <img src={icono} alt={titulo} />
                <div className="valor-info">
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Nosotros