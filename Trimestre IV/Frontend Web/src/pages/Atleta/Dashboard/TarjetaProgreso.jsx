export default function TarjetaProgreso({ categorias }) {
  return (
    <article className="tarjeta-dashboard tarjeta-progreso">
      <header className="tarjeta-dashboard__header"><h2>Progreso semanal</h2></header>
      <div className="tarjeta-dashboard__contenido">
        <div className="lista-progreso">
          {categorias.map(({ id, nombre, valor, color }) => (
            <div className="barra-progreso" key={id}>
              <div className="barra-progreso__etiqueta">
                <span>{nombre}</span><span>{valor === null ? '—' : `${valor}%`}</span>
              </div>
              <div className="barra-progreso__pista">
                <div className={`barra-progreso__relleno barra-progreso__relleno--${color}`}
                  style={{ width: `${valor ?? 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}