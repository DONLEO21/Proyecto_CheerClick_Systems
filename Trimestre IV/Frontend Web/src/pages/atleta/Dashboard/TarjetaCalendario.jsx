import { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MESES, DIAS, pad, dia10, fechaLocal, hora12, mayus } from './dashboardAtletaData.js';

export default function TarjetaCalendario({
  mes, onCambiarMes, porDia, asistencias, cargando,
  diaSel, onSeleccionarDia, hoy, onVerEntrenamientos,
}) {
  const asistPorDia = useMemo(() => {
    const m = {};
    asistencias.forEach((a) => { m[dia10(a.fecha)] = !!a.presente; });
    return m;
  }, [asistencias]);

  const primerDiaSemana = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const prefijoMes = `${mes.getFullYear()}-${pad(mes.getMonth() + 1)}`;
  const delDia = diaSel.startsWith(prefijoMes) ? porDia[diaSel] ?? [] : null;
  const fechaLarga = mayus(
    fechaLocal(diaSel).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }),
  );

  return (
    <article className="tarjeta-dashboard tarjeta-calendario">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <Calendar size={24} strokeWidth={2} /><h2>Calendario</h2>
      </header>

      <div className="tarjeta-dashboard__contenido">
        <div className="calendario__cabecera">
          <button type="button" className="calendario__flecha" aria-label="Mes anterior" onClick={() => onCambiarMes(-1)}>
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <span className="calendario__mes-actual">{MESES[mes.getMonth()]}, {mes.getFullYear()}</span>
          <button type="button" className="calendario__flecha" aria-label="Mes siguiente" onClick={() => onCambiarMes(1)}>
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={`cal-grid ${cargando ? 'cal-grid--cargando' : ''}`} role="grid" aria-label="calendario de entrenamientos">
          {DIAS.map((d) => <span key={d} className="cal-grid__semana">{d}</span>)}
          {Array.from({ length: primerDiaSemana }, (_, i) => <span key={`v${i}`} />)}
          {Array.from({ length: diasDelMes }, (_, i) => i + 1).map((d) => {
            const f = `${prefijoMes}-${pad(d)}`;
            const clases = ['cal-grid__dia'];
            // Solo se pinta de rojo/verde si ese día tenía entrenamiento programado.
            const huboEntreno = !!porDia[f];
            if (huboEntreno && asistPorDia[f] === true) clases.push('cal-grid__dia--asistio');
            if (huboEntreno && asistPorDia[f] === false) clases.push('cal-grid__dia--fallo');
            if (huboEntreno) clases.push('cal-grid__dia--entreno');
            if (f === hoy) clases.push('cal-grid__dia--hoy');
            if (f === diaSel) clases.push('cal-grid__dia--sel');
            return (
              <button key={f} type="button" className={clases.join(' ')} aria-pressed={f === diaSel}
                aria-label={`${d} de ${MESES[mes.getMonth()]}${porDia[f] ? ', hay entrenamiento' : ''}`}
                onClick={() => onSeleccionarDia(f)}>
                {d}
              </button>
            );
          })}
        </div>

        <ul className="calendario__leyenda">
          <li className="calendario__leyenda-item"><span className="calendario__punto calendario__punto--verde" /> Asistí</li>
          <li className="calendario__leyenda-item"><span className="calendario__punto calendario__punto--rojo" /> Falté</li>
        </ul>

        {/* detalle del día: alto fijo con scroll interno, la tarjeta nunca crece */}
        {delDia && (
          <div className="cal-detalle">
            <strong>{fechaLarga}</strong>
            {delDia.length === 0 ? (
              <p>Sin entrenamientos programados.</p>
            ) : (
              <ul className="cal-detalle__lista">
                {delDia.map((e) => (
                  <li key={e.id}>
                    <span className="cal-detalle__hora">
                      {hora12(e.hora_inicio)}{e.hora_fin ? ` – ${hora12(e.hora_fin)}` : ''}
                    </span>
                    <span>{e.titulo || 'Entrenamiento'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
        onClick={onVerEntrenamientos}>
        Ver entrenamientos
      </button>
    </article>
  );
}