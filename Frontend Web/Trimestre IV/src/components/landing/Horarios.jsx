const horarios = [
  ['Nivel Inicio | Formativo King', 'Entrenador: Jonathan Cruz', [
    ['Lunes', '4:00 - 6:00 PM'],
    ['Martes', '4:00 - 6:00 PM'],
    ['Viernes', '4:00 - 6:00 PM'],
  ]],
  ['Nivel 1 | Queens', 'Entrenadora: Alexandra Rivera', [
    ['Martes', '6:00 - 8:00 PM'],
    ['Jueves', '6:00 - 8:00 PM'],
    ['Sábado', '6:00 - 8:00 PM'],
  ]],
  ['Nivel 2 | Princess', 'Entrenadora: Yari Gutierrez', [
    ['Martes', '6:00 - 8:00 PM'],
    ['Viernes', '6:00 - 8:00 PM'],
    ['Sábado', '10:00 - 12:00 PM'],
  ]],
  ['Nivel 3 | Magic', 'Entrenador: Stuard Reyes', [
    ['Lunes', '6:00 - 8:00 PM'],
    ['Miércoles', '6:00 - 8:00 PM'],
    ['Sábado', '4:00 - 6:00 PM'],
  ]],
  ['Nivel 4 | Blood Tigers', 'Entrenador: Ronald Linares', [
    ['Miércoles', '8:00 - 10:00 PM'],
    ['Sábado', '8:00 - 10:00 PM'],
    ['Domingo', '8:00 - 10:00 AM'],
  ]],
]

function Horarios() {
  return (
    <section id="horarios">
      <div className="contenedor">
        <div className="horarios-contenido">
          <div className="seccion-titulo">
            <h1>PLANIFICACIÓN</h1>
          </div>
          <h2>HORARIOS DE ENTRENAMIENTO</h2>
          <p>Cada entrenador y nivel tiene sus horarios definidos. ¡Encuentra el tuyo y únete al equipo!</p>

          <div className="horario-valores">
            {horarios.map(([titulo, entrenador, dias]) => (
              <article className="horario-tarjeta" key={titulo}>
                <header className="tarjeta-encabezado">
                  <h3>{titulo}</h3>
                  <h4>{entrenador}</h4>
                </header>
                <ul className="lista-horarios">
                  {dias.map(([dia, hora]) => (
                    <li key={dia}>
                      <p className="dia">{dia}</p>
                      <p className="hora">{hora}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Horarios