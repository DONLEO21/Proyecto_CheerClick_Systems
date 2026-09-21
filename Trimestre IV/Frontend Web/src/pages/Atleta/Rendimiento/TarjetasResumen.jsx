// Color de la barra del puntaje según el porcentaje
function colorBarra(porcentaje) {
  if (porcentaje >= 80) return "verde";
  if (porcentaje >= 50) return "amarillo";
  return "rojo";
}

function TarjetasResumen({ puntaje, completadas, total }) {
  const porcentajeHabilidades = total ? Math.round((completadas / total) * 100) : 0;

  return (
    <section className="resumen-cards">
      <div className="rcard">
        <div className="rcard__header">
          <span className="rcard__titulo">Puntaje Total</span>
          <div className="rcard__icono-wrap rcard__icono-wrap--azul">
            <i className="bi bi-activity"></i>
          </div>
        </div>
        <span className="rcard__valor">{puntaje}%</span>
        <span className="rcard__nota">Rendimiento general</span>
        <div className="rcard__barra-wrap">
          <div
            className={`rcard__barra-fill rcard__barra-fill--${colorBarra(puntaje)}`}
            style={{ width: `${puntaje}%` }}
          />
        </div>
      </div>

      <div className="rcard">
        <div className="rcard__header">
          <span className="rcard__titulo">Habilidades</span>
          <div className="rcard__icono-wrap rcard__icono-wrap--verde">
            <i className="bi bi-check-lg"></i>
          </div>
        </div>
        <span className="rcard__valor">
          {completadas}
          <span className="rcard__valor-total"> / {total}</span>
        </span>
        <span className="rcard__nota">{total - completadas} por lograr</span>
        <div className="rcard__barra-wrap">
          <div
            className="rcard__barra-fill rcard__barra-fill--verde"
            style={{ width: `${porcentajeHabilidades}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default TarjetasResumen;