import { TrendingUp } from 'lucide-react';

function GraficaHabilidades({ habilidades }) {
  const total = habilidades.length;
  const aprobadas = habilidades.filter((h) => h.estado === 'aprobado').length;
  const porcentaje = total ? Math.round((aprobadas / total) * 100) : 0;
  const radio = 80;
  const circ = 2 * Math.PI * radio;
  const relleno = (circ * porcentaje) / 100;

  return (
    <>
      <svg viewBox="0 0 200 200" className="svg-habilidades" role="img"
        aria-label={`${porcentaje}% de habilidades dominadas`}>
        <circle cx="100" cy="100" r={radio} fill="none" stroke="#f1e6e6" strokeWidth="14" />
        <circle cx="100" cy="100" r={radio} fill="none" stroke="var(--rojo)" strokeWidth="14"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - relleno}
          transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset .5s ease' }} />
        <text x="100" y="96" textAnchor="middle" fontSize="34" fontWeight="700">{porcentaje}%</text>
        <text x="100" y="118" textAnchor="middle" fontSize="12" fill="var(--texto-muted)">Habilidades</text>
        <text x="100" y="132" textAnchor="middle" fontSize="12" fill="var(--texto-muted)">dominadas</text>
      </svg>
      <p className="svg-habilidades__etiqueta">
        <TrendingUp size={14} strokeWidth={2} /> {aprobadas} de {total} habilidades completadas
      </p>
    </>
  );
}

export default function TarjetaRendimiento({ habilidades, variacion, onVer }) {
  return (
    <article className="tarjeta-dashboard tarjeta-rendimiento">
      <header className="tarjeta-dashboard__header"><h2>Tu rendimiento</h2></header>
      <div className="tarjeta-dashboard__contenido tarjeta-rendimiento__contenido">
        <figure className="grafico-rendimiento">
          <GraficaHabilidades habilidades={habilidades} />
        </figure>
        <p className="tarjeta-progreso__variacion">
          {variacion === null ? (
            <span>Sin datos para comparar</span>
          ) : (
            <>
              <TrendingUp size={18} strokeWidth={2} className={variacion < 0 ? 'icono-invertido' : ''} />
              <strong className={variacion < 0 ? 'variacion--baja' : ''}>
                {variacion >= 0 ? '+' : ''}{variacion}%
              </strong>{' '}
              respecto a la semana pasada
            </>
          )}
        </p>
        <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
          onClick={onVer}>
          Ver mi Rendimiento
        </button>
      </div>
    </article>
  );
}

export function TarjetaProgreso({ categorias }) {
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