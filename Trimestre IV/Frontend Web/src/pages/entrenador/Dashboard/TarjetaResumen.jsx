import { Users, CalendarDays, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function TarjetaResumen({ cargando, atletasActivos, entrenosHoy, metricas }) {
  const mostrar = (v, sufijo = '') => (cargando || v === null || v === undefined ? '—' : `${v}${sufijo}`)

  const stats = [
    { id: 'atletas', Icono: Users, color: 'rojo', valor: mostrar(atletasActivos), etiqueta: 'Atletas activos' },
    { id: 'hoy', Icono: CalendarDays, color: 'azul', valor: mostrar(entrenosHoy), etiqueta: 'Entrenamientos hoy' },
    { id: 'rend', Icono: TrendingUp, color: 'verde', valor: mostrar(metricas.rendimiento, '%'), etiqueta: 'Rendimiento promedio' },
    { id: 'asis', Icono: CheckCircle2, color: 'morado', valor: mostrar(metricas.asistencia, '%'), etiqueta: 'Asistencia promedio' },
  ]

  return (
    <article className="de-tarjeta de-col-14">
      <h2 className="de-titulo">Resumen rápido</h2>
      <div className="de-stats">
        {stats.map(({ id, Icono, color, valor, etiqueta }) => (
          <div className="de-stat" key={id}>
            <span className={`de-stat__icono de-stat__icono--${color}`}><Icono size={28} strokeWidth={2} /></span>
            <strong className="de-stat__valor">{valor}</strong>
            <span className="de-stat__etiqueta">{etiqueta}</span>
          </div>
        ))}
      </div>
    </article>
  )
}