const servicios = [
  ['../src/assets/img/BTC-salto.jpg', 'Acrobacia', 'Construimos elevaciones y lanzamientos espectaculares basados en la técnica y el control. Sincronizamos la fuerza de nuestro equipo para crear pirámides sólidas y transiciones fluidas en el aire. Hacemos que cada ejecución sea limpia y segura, demostrando el resultado de nuestra disciplina y confianza colectiva.'],
  ['../src/assets/img/BTC-competencia.jpg', 'Coreografía', 'El momento de brillar y conectar en la pista. Creamos secuencias visuales coordinadas que combinan baile, sincronía y actitud, convirtiendo cada bloque musical en un espectáculo memorable para los jueces.'],
  ['../src/assets/img/BTC- campeones.jpg', 'Competencias', 'Participamos como club en torneos locales y nacionales, representando a Bogotá en el mundo del cheerleading. Cada atleta tiene la oportunidad de demostrar su progreso en escenarios reales.'],
  ['../src/assets/img/BTC-piramides.jpg', 'Gimnasia', 'Desarrollamos la potencia, flexibilidad y técnica de ejecución en acrobacias de suelo y saltos. Trabajamos desde las bases posturales hasta giros avanzados para garantizar ejecuciones limpias, estables y seguras en cada rutina.'],
  ['../src/assets/img/BTC-universal.jpg', 'Partner', 'Entrenamos habilidades de partner y grupos acrobáticos, fortaleciendo la confianza, coordinación y sincronización entre los atletas. Esta unión es la base de nuestro éxito en el escenario.'],
]

function Servicios() {
  return (
    <section id="servicios">
      <div className="contenedor">
        <div className="servicios-contenido">
          <div className="seccion-titulo">
            <h1>SERVICIOS</h1>
          </div>
          <h2>NUESTROS SERVICIOS</h2>
          <p>En Blood Tigers preparamos atletas completos, fuertes y disciplinados. A través de nuestras diferentes áreas de entrenamiento,<br />garantizamos un proceso técnico y seguro adaptado a todas las edades y niveles de rendimiento.</p>

          <div className="servicios-valores">
            {servicios.map(([imagen, titulo, texto]) => (
              <article className="servicio-tarjetas" key={titulo}>
                <img src={imagen} alt={`Foto Blood Tigers Cheer - ${titulo}`} />
                <h2>{titulo}</h2>
                <p>{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Servicios