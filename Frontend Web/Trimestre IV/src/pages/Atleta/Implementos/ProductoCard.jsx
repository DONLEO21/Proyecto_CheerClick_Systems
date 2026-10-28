export default function ProductoCard({ implemento, onSolicitar }) {
  const estrellas = Math.round(implemento.calificacion || 0);

  return (
    <article className="tarjeta-producto">
      <div className="producto-imagen">
        <img src={implemento.imagen || "/img/placeholder.png"} alt={implemento.nombre} />
      </div>
      <div className="producto-info">
        <h4>{implemento.nombre}</h4>
        <div className="calificacion" aria-label={`Calificación: ${estrellas} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < estrellas ? "estrella-llena" : "estrella-vacia"}>★</span>
          ))}
          <span className="conteo-resenas">({implemento.resenas || 0})</span>
        </div>
        <p className="precio">${Number(implemento.precio).toLocaleString("es-CO")}</p>
        <button type="button" className="btn-solicitar" onClick={() => onSolicitar(implemento)}>
          Solicitar pedido
        </button>
      </div>
    </article>
  );
}