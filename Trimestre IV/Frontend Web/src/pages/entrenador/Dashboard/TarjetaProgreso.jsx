import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

export default function TarjetaProgreso({ metricas, cargando }) {
  const { variacion, serie, esDemo } = metricas

  return (
    <article className="de-tarjeta de-col-6">
      <h2 className="de-titulo">Progreso últimas 4 semanas</h2>
      <p className="de-variacion">
        {variacion === null ? (
          <span className="de-variacion--nulo">Sin datos para comparar</span>
        ) : (
          <>
            <span className={variacion >= 0 ? 'de-variacion--sube' : 'de-variacion--baja'}>
              <TrendingUp size={16} strokeWidth={2.4} className={variacion < 0 ? 'de-invertido' : ''} />
              {' '}{Math.abs(variacion).toFixed(1)}%
            </span>{' '}
            vs. semana anterior
          </>
        )}
      </p>
      <div className="de-grafico">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={serie} margin={{ top: 10, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcdcdc" />
            <XAxis dataKey="semana" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, 'Rendimiento']} />
            <Line type="linear" dataKey="valor" stroke="#d71920" strokeWidth={2}
              dot={{ r: 5, fill: '#d71920', stroke: '#d71920' }} activeDot={{ r: 6 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
        {!cargando && esDemo && (
          <p className="de-grafico__vacio">Datos de ejemplo — se reemplazarán cuando haya evaluaciones registradas.</p>
        )}
      </div>
    </article>
  )
}