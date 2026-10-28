import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { MESES_CORTO, TORNEOS_POR_PAGINA, fechaLocal } from './dashboardAtletaData.js';

function TorneoCard({ torneo, inscrito, indice, onClick }) {
  const f = fechaLocal(torneo.fecha);
  return (
    <button type="button" className="torneo-card" style={{ animationDelay: `${0.05 * indice}s` }}
      onClick={onClick}>
      <div className={`torneo-card__fecha torneo-card__fecha--${inscrito ? 'rojo' : 'oscuro'}`}>
        <span className="torneo-card__dia">{f.getDate()}</span>
        <span className="torneo-card__mes">{MESES_CORTO[f.getMonth()]}</span>
      </div>
      <div className="torneo-card__info">
        <span className="torneo-card__nombre">{torneo.nombre}</span>
        <span className="torneo-card__lugar"><MapPin size={12} strokeWidth={2} />{torneo.lugar}</span>
      </div>
      <span className={`torneo-card__estado torneo-card__estado--${inscrito ? 'inscrita' : 'pendiente'}`}>
        {inscrito ? 'Inscrita' : 'Por inscribir'}
      </span>
    </button>
  );
}

export default function SeccionTorneos({ torneos, inscritos, onSeleccionar }) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(torneos.length / TORNEOS_POR_PAGINA));
  const visibles = torneos.slice((pagina - 1) * TORNEOS_POR_PAGINA, pagina * TORNEOS_POR_PAGINA);

  return (
    <section className="tarjeta-dashboard tarjeta-torneos" aria-label="próximos torneos">
      <header className="tarjeta-dashboard__header torneos__header">
        <div className="torneos__titulo-grupo">
          <h2>Próximos Torneos</h2>
          <p className="torneos__subtitulo">Competencias programadas</p>
        </div>
        <div className="torneos__controles">
          <span className="torneos__contador">{torneos.length} eventos</span>
          {totalPaginas > 1 && (
            <div className="torneos__paginador" role="group" aria-label="paginación de torneos">
              <button type="button" aria-label="Anteriores" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
                <ChevronLeft size={16} strokeWidth={2.2} />
              </button>
              <span>{pagina} / {totalPaginas}</span>
              <button type="button" aria-label="Siguientes" disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}>
                <ChevronRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="torneos__lista">
        {torneos.length === 0 && <p className="torneos__vacio">No hay torneos programados.</p>}
        {visibles.map((t, i) => (
          <TorneoCard key={t.id} torneo={t} indice={i}
            inscrito={inscritos.includes(String(t.id))}
            onClick={() => onSeleccionar(t.id)} />
        ))}
      </div>
    </section>
  );
}