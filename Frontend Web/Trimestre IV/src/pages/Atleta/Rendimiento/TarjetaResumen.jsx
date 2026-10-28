// Tarjeta de resumen genérica: usa las mismas clases (.rcard…) que TarjetasResumen.
// `icono` es una clase de bootstrap-icons (p. ej. "bi-check-lg").
function TarjetaResumen({ titulo, icono, colorIcono, valor, colorValor, sufijo, nota, barra }) {
  return (
    <div className="rcard">
      <div className="rcard__header">
        <span className="rcard__titulo">{titulo}</span>
        <div className={`rcard__icono-wrap rcard__icono-wrap--${colorIcono}`}>
          <i className={`bi ${icono}`} aria-hidden="true"></i>
        </div>
      </div>
      <span className={`rcard__valor${colorValor ? ` rcard__valor--${colorValor}` : ""}`}>
        {valor}
        {sufijo && <span className="rcard__valor-total"> {sufijo}</span>}
      </span>
      <span className="rcard__nota">{nota}</span>
      {barra && (
        <div
          className="rcard__barra-wrap"
          role="progressbar"
          aria-label={titulo}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={barra.porcentaje}
        >
          <div className={`rcard__barra-fill rcard__barra-fill--${barra.color}`} style={{ width: `${barra.porcentaje}%` }} />
        </div>
      )}
    </div>
  );
}

export default TarjetaResumen;
