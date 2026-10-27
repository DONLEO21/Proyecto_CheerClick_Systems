
export default function ResumenCard({ tipo, icono, cantidad, etiqueta }) {
  return (
    <article
      className={`pqrs-resumen-card pqrs-resumen-card--${tipo}`}
      aria-label={`${cantidad} ${etiqueta}`}
    >
      <span className="pqrs-resumen-icono" aria-hidden="true">
        <i className={`bi ${icono}`} />
      </span>

      <div>
        <p className="pqrs-resumen-cifra">
          <strong>{cantidad}</strong>
          <span>{etiqueta}</span>
        </p>
        <p className="pqrs-resumen-sub">Total activos</p>
      </div>
    </article>
  );
}
