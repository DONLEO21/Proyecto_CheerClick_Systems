import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { MESES, DIAS, pad, hora12 } from './dashboardEntrenadorData.js'

export default function TarjetaCalendario({
  mes, onCambiarMes, porDia, cargando, diaSel, onSeleccionarDia, hoy, nombreNivel, onVer,
}) {
  const primerDiaSemana = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay()
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()
  const prefijoMes = `${mes.getFullYear()}-${pad(mes.getMonth() + 1)}`
  const delDia = diaSel.startsWith(prefijoMes) ? porDia[diaSel] ?? [] : null
  const fechaLarga = new Date(`${diaSel}T00:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <article className="de-tarjeta de-col-5">
      <h2 className="de-titulo de-titulo--icono"><Calendar size={24} strokeWidth={2} /> Calendario</h2>

      <div className="de-cal-nav">
        <button type="button" aria-label="Mes anterior" onClick={() => onCambiarMes(-1)}><ChevronLeft size={18} /></button>
        <strong>{MESES[mes.getMonth()]}, {mes.getFullYear()}</strong>
        <button type="button" aria-label="Mes siguiente" onClick={() => onCambiarMes(1)}><ChevronRight size={18} /></button>
      </div>

      <div className={`de-cal ${cargando ? 'de-cal--cargando' : ''}`} role="grid" aria-label="calendario de entrenamientos">
        {DIAS.map((d) => <span key={d} className="de-cal__dia-semana">{d}</span>)}
        {Array.from({ length: primerDiaSemana }, (_, i) => <span key={`v${i}`} />)}
        {Array.from({ length: diasDelMes }, (_, i) => i + 1).map((d) => {
          const f = `${prefijoMes}-${pad(d)}`
          const clases = ['de-cal__dia']
          if (porDia[f]) clases.push('de-cal__dia--entreno')
          if (f === hoy) clases.push('de-cal__dia--hoy')
          if (f === diaSel) clases.push('de-cal__dia--sel')
          return (
            <button key={f} type="button" className={clases.join(' ')} aria-pressed={f === diaSel}
              aria-label={`${d} de ${MESES[mes.getMonth()]}${porDia[f] ? ', hay entrenamiento' : ''}`}
              onClick={() => onSeleccionarDia(f)}>
              {d}
            </button>
          )
        })}
      </div>

      <p className="de-cal__leyenda"><span className="de-cal__punto" /> Día de entrenamiento</p>

      {delDia && (
        <div className="de-cal__detalle">
          <strong>{fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1)}</strong>
          {delDia.length === 0 ? (
            <p>Sin entrenamientos programados.</p>
          ) : (
            <ul>
              {delDia.map((e) => (
                <li key={e.id}>
                  <span className="de-cal__hora">{hora12(e.hora_inicio)}{e.hora_fin ? ` – ${hora12(e.hora_fin)}` : ''}</span>
                  <span>{nombreNivel[String(e.id_nivel)] ?? 'Nivel'}{e.titulo ? ` · ${e.titulo}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button type="button" className="de-btn-rojo de-btn-rojo--ancho" onClick={onVer}>
        Ver mis entrenamientos
      </button>
    </article>
  )
}