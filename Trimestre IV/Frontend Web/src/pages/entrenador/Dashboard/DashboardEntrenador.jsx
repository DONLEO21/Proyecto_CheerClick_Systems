import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Users, CalendarDays, TrendingUp, CheckCircle2, Search, Filter,
  ChevronLeft, ChevronRight, SquarePen, Calendar,
} from 'lucide-react'
import Header from '../../../components/Header/Header.jsx'
import Sidebar from '../../../components/Sidebar/Sidebar.jsx'
import AvisoToast from '../../../components/AvisoToast'
import menuEntrenador from '../../../data/menuEntrenador.js'
import { supabase } from '../../../services/supabase'
import useUsuario from '../../../hooks/useUsuario'
import useAviso from '../../../hooks/useAviso'
import './DashboardEntrenador.css'

const DB = {
  usuarios: 'usuarios',
  niveles: 'niveles',
  entrenamientos: 'entrenamientos',
  asistencias: 'asistencias',
  evaluaciones: 'evaluaciones',
}

const RUTA_PERFIL = '/entrenador/perfil'
const RUTA_ENTRENAMIENTOS = '/entrenador/entrenamientos'
const RUTA_INICIO_ENTRENADOR = '/entrenador'

// true = muestra datos de ejemplo SIEMPRE (para probar la interfaz sin tocar la BD)
const USAR_DATOS_DEMO = false

// datos de ejemplo //
const DEMO_SI_NO_HAY_NIVEL = true

const MAX_ITEMS = 3 // atletas visibles por página

const CATEGORIAS = [
  { id: 'baile',    nombre: 'Baile',    color: '#a847e0' },
  { id: 'gimnasia', nombre: 'Gimnasia', color: '#f8df3e' },
  { id: 'partner',  nombre: 'Partner',  color: '#2f80ed' },
]

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

/* ───────── utilidades ───────── */
const pad = (n) => String(n).padStart(2, '0')
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const hace = (dias) => { const d = new Date(); d.setDate(d.getDate() - dias); return d }
const dia10 = (f) => String(f).slice(0, 10)
const prom = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null)
const notaEval = (e) =>
  prom(CATEGORIAS.map((c) => Number(e[c.id])).filter((n) => Number.isFinite(n)))
const hora12 = (h) => {
  if (!h) return ''
  const [H, M] = String(h).split(':').map(Number)
  return `${H % 12 || 12}:${pad(M)} ${H >= 12 ? 'PM' : 'AM'}`
}

/* ───────── acceso a datos ───────── */
async function pedir(tabla, armar) {
  const { data, error } = await armar(supabase.from(tabla))
  if (error) throw new Error(`${tabla}: ${error.message}`)
  return data ?? []
}

// Niveles que coordina el entrenador + atletas de esos niveles + evaluaciones y asistencias
async function cargarBase(uid) {
  const errores = []
  const seguro = async (tabla, armar) => {
    try { return await pedir(tabla, armar) } catch (e) { errores.push(e.message); return [] }
  }

  const niveles = await seguro(DB.niveles, (t) => t.select('id,nombre').eq('id_entrenador', uid).order('nombre'))
  const ids = niveles.map((n) => n.id)
  if (!ids.length) return { niveles, atletas: [], evals: [], asist: [], errores }

  const [atletas, evals, asist] = await Promise.all([
    seguro(DB.usuarios, (t) =>
      t.select('id,codigo,nombre,activo,id_nivel').eq('rol', 'atleta').eq('estado', 'aprobada').in('id_nivel', ids).order('nombre')),
    seguro(DB.evaluaciones, (t) =>
      t.select('fecha,baile,gimnasia,partner').in('id_nivel', ids).gte('fecha', iso(hace(27)))),
    seguro(DB.asistencias, (t) =>
      t.select('fecha,presente').in('id_nivel', ids).gte('fecha', iso(hace(29)))),
  ])
  return { niveles, atletas, evals, asist, errores }
}

async function cargarEntrenos(ids, desde, hasta) {
  if (!ids.length) return []
  return pedir(DB.entrenamientos, (t) =>
    t.select('id,id_nivel,titulo,fecha,hora_inicio,hora_fin')
      .in('id_nivel', ids).gte('fecha', desde).lte('fecha', hasta)
      .order('fecha').order('hora_inicio'))
}

/* ───────── datos de ejemplo (USAR_DATOS_DEMO) ───────── */
const DEMO_BASE = (() => {
  const nombres = ['Ana López', 'Juan Pérez', 'Gabriela Deaquiz', 'Camila Rojas', 'Mateo Díaz', 'Valentina Cruz', 'Samuel Ortiz', 'Laura Gómez']
  const niveles = [{ id: 1, nombre: 'Nivel 3 Magic' }, { id: 2, nombre: 'Nivel 2 Elite' }]
  const atletas = nombres.map((n, i) => ({
    id: `demo-${i}`, codigo: `AT${100 + i}`, nombre: n,
    activo: i !== 2 && i !== 6, id_nivel: i % 3 === 2 ? 2 : 1,
  }))
  const base = [62, 68, 74, 80] // sube semana a semana
  const evals = base.map((b, w) => ({
    fecha: iso(hace(3 + 7 * (3 - w))),
    baile: b + 8, gimnasia: b + 12, partner: b - 6,
  }))
  const asist = Array.from({ length: 25 }, (_, i) => ({ fecha: iso(hace(i)), presente: i % 13 !== 0 }))
  return { niveles, atletas, evals, asist, errores: [] }
})()

const TIPOS_ENTRENO = ['Baile', 'Gimnasia', 'Partner']

function demoEntrenos(desde, hasta, niveles) {
  const out = []
  const fin = new Date(`${hasta}T00:00:00`)
  for (let d = new Date(`${desde}T00:00:00`); d <= fin; d.setDate(d.getDate() + 1)) {
    if (![2, 4, 6].includes(d.getDay())) continue
    const n = d.getDate()
    const sesiones = [{ tipo: TIPOS_ENTRENO[n % 3], nivel: niveles[n % niveles.length], ini: '18:00:00', fin: '19:30:00' }]
    if (n % 4 === 0) { // ~1 de cada 4 días hay una segunda sesión
      sesiones.push({ tipo: TIPOS_ENTRENO[(n + 1) % 3], nivel: niveles[(n + 1) % niveles.length], ini: '19:30:00', fin: '21:00:00' })
    }
    sesiones.forEach((x, idx) => out.push({
      id: `${iso(d)}-${idx}`, id_nivel: x.nivel.id, titulo: x.tipo,
      fecha: iso(d), hora_inicio: x.ini, hora_fin: x.fin,
    }))
  }
  return out
}

/* ───────── subcomponentes ───────── */
function PieTabla({ pagina, totalPaginas, total, desde, hasta, onCambiar }) {
  if (total <= MAX_ITEMS) return null
  return (
    <footer className="de-pie">
      <span>Mostrando {desde}–{hasta} de {total}</span>
      <div className="de-paginador" role="group" aria-label="paginación de atletas">
        <button type="button" aria-label="Página anterior" disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <span className="de-paginador__indicador">{pagina} / {totalPaginas}</span>
        <button type="button" aria-label="Página siguiente" disabled={pagina >= totalPaginas} onClick={() => onCambiar(pagina + 1)}>
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </footer>
  )
}

/* pantalla */
export default function DashboardEntrenador({
  nombreEntrenador = 'Entrenador',
  onNavigate = (href) => { window.location.href = href },
}) {
  const usuario = useUsuario()
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : nombreEntrenador)
  const primerNombre = nombreCompleto.split(' ')[0]
  const { aviso, mostrarAviso } = useAviso()

  const hoy = iso(new Date())

  // ── datos base (niveles, atletas, evaluaciones, asistencias)
  const [base, setBase] = useState({ niveles: [], atletas: [], evals: [], asist: [], errores: [] })
  const [cargando, setCargando] = useState(true)
  const [demo, setDemo] = useState(USAR_DATOS_DEMO) // true = se muestran datos quemados

  useEffect(() => {
    let vivo = true
    const cargar = async () => {
      if (USAR_DATOS_DEMO) return DEMO_BASE
      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) throw new Error('No hay una sesión activa.')
      return cargarBase(uid)
    }
    const usarDemo = () => { setBase(DEMO_BASE); setDemo(true) }

    cargar()
      .then((b) => {
        if (!vivo) return
        // Sin nivel asignado (o sin poder leerlo): datos quemados
        if (DEMO_SI_NO_HAY_NIVEL && b.niveles.length === 0) {
          if (b.errores.length) console.warn('Dashboard entrenador (usando datos de ejemplo):', b.errores)
          return usarDemo()
        }
        setBase(b)
        if (b.errores.length) mostrarAviso(`No se pudo leer: ${b.errores[0]}`, 'error')
      })
      .catch((e) => {
        if (!vivo) return
        mostrarAviso(e.message, 'error')
        if (DEMO_SI_NO_HAY_NIVEL) usarDemo()
      })
      .finally(() => vivo && setCargando(false))
    return () => { vivo = false }
  }, [])

  const idsNivel = useMemo(() => base.niveles.map((n) => n.id), [base.niveles])
  const clavesNivel = idsNivel.join(',')
  const nombreNivel = useMemo(
    () => Object.fromEntries(base.niveles.map((n) => [String(n.id), n.nombre])),
    [base.niveles]
  )
  const tieneNivel = base.niveles.length > 0

  // ── calendario
  const [mes, setMes] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [entrenos, setEntrenos] = useState([])
  const [entrenosHoy, setEntrenosHoy] = useState(null)
  const [cargandoCal, setCargandoCal] = useState(false)
  const [diaSel, setDiaSel] = useState(hoy)

  const obtenerEntrenos = (desde, hasta) =>
    demo
      ? Promise.resolve(demoEntrenos(desde, hasta, base.niveles))
      : cargarEntrenos(idsNivel, desde, hasta)

  const mesClave = `${mes.getFullYear()}-${mes.getMonth()}`

  useEffect(() => {
    if (cargando) return
    let vivo = true
    setCargandoCal(true)
    const desde = iso(mes)
    const hasta = iso(new Date(mes.getFullYear(), mes.getMonth() + 1, 0))
    obtenerEntrenos(desde, hasta)
      .then((r) => vivo && setEntrenos(r))
      .catch((e) => { if (vivo) { setEntrenos([]); mostrarAviso(e.message, 'error') } })
      .finally(() => vivo && setCargandoCal(false))
    return () => { vivo = false }
  }, [mesClave, cargando, clavesNivel, demo])

  useEffect(() => {
    if (cargando) return
    let vivo = true
    obtenerEntrenos(hoy, hoy)
      .then((r) => vivo && setEntrenosHoy(r.length))
      .catch(() => vivo && setEntrenosHoy(null))
    return () => { vivo = false }
  }, [cargando, clavesNivel, demo])

  const porDia = useMemo(() => {
    const m = {}
    entrenos.forEach((e) => {
      const f = dia10(e.fecha)
      if (!m[f]) m[f] = []
      m[f].push(e)
    })
    return m
  }, [entrenos])

  const primerDiaSemana = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay()
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()
  const prefijoMes = `${mes.getFullYear()}-${pad(mes.getMonth() + 1)}`
  const cambiarMes = (delta) => setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1))
  const delDia = diaSel.startsWith(prefijoMes) ? porDia[diaSel] ?? [] : null
  const fechaLarga = new Date(`${diaSel}T00:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  // ── métricas calculadas con los datos reales
  const metricas = useMemo(() => {
    const notas = base.evals.map(notaEval).filter((n) => n !== null)
    const rendimiento = notas.length ? Math.round(prom(notas)) : null

    // 4 semanas, la más antigua primero (Sem 1 … Sem 4)
    const serie = [0, 1, 2, 3].map((i) => {
      const desde = iso(hace(7 * (4 - i) - 1))
      const hasta = iso(hace(7 * (3 - i)))
      const v = base.evals
        .filter((e) => dia10(e.fecha) >= desde && dia10(e.fecha) <= hasta)
        .map(notaEval).filter((n) => n !== null)
      return { semana: `Sem ${i + 1}`, valor: v.length ? Math.round(prom(v)) : null }
    })
    const [previa, actual] = [serie[2].valor, serie[3].valor]
    const variacion = previa && actual !== null ? ((actual - previa) / previa) * 100 : null

    const totalAsist = base.asist.length
    const asistencia = totalAsist
      ? Math.round((base.asist.filter((a) => a.presente).length * 100) / totalAsist)
      : null

    const equipo = CATEGORIAS.map((c) => {
      const v = base.evals.map((e) => Number(e[c.id])).filter((n) => Number.isFinite(n))
      return { ...c, valor: v.length ? Math.round(prom(v)) : null }
    })

    return { rendimiento, serie, variacion, asistencia, equipo, hayProgreso: serie.some((s) => s.valor !== null) }
  }, [base.evals, base.asist])

  const atletasActivos = base.atletas.filter((a) => a.activo).length
  const mostrar = (v, sufijo = '') => (cargando || v === null || v === undefined ? '—' : `${v}${sufijo}`)

  // ── lista de atletas (del nivel del entrenador): búsqueda + filtro + paginación de 3
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtrados = base.atletas.filter(
    (a) =>
      (!categoria || String(a.id_nivel) === categoria) &&
      `${a.nombre} ${a.codigo ?? ''}`.toLowerCase().includes(busqueda.trim().toLowerCase())
  )
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / MAX_ITEMS))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * MAX_ITEMS
  const visibles = filtrados.slice(inicio, inicio + MAX_ITEMS)

  useEffect(() => { setPagina(1) }, [busqueda, categoria])

  const textoVacio = !tieneNivel
    ? 'Aún no tienes un nivel asignado.'
    : base.atletas.length === 0
      ? 'No hay atletas asignados a tu nivel.'
      : 'Ningún atleta coincide con tu búsqueda.'

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/acceso'
  }
  const irAInicio = () => { window.location.href = '/' }

  const stats = [
    { id: 'atletas', Icono: Users, color: 'rojo', valor: mostrar(atletasActivos), etiqueta: 'Atletas activos' },
    { id: 'hoy', Icono: CalendarDays, color: 'azul', valor: mostrar(entrenosHoy), etiqueta: 'Entrenamientos hoy' },
    { id: 'rend', Icono: TrendingUp, color: 'verde', valor: mostrar(metricas.rendimiento, '%'), etiqueta: 'Rendimiento promedio' },
    { id: 'asis', Icono: CheckCircle2, color: 'morado', valor: mostrar(metricas.asistencia, '%'), etiqueta: 'Asistencia promedio' },
  ]

  return (
    <>
      <Sidebar
        items={menuEntrenador}
        activeHref={RUTA_INICIO_ENTRENADOR}
        onNavigate={(href) => (window.location.href = href)}
      />
      <Header rol="Entrenador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

      <main className="de-pagina">
        <div className="de-grid">

          {/* bienvenida */}
          <section className="de-tarjeta de-tarjeta--plana de-col-20 de-bienvenida" aria-labelledby="de-titulo">
            <h1 id="de-titulo">Hola, {primerNombre} 👋</h1>
            <button type="button" className="de-btn-rojo" onClick={() => onNavigate(RUTA_PERFIL)}>
              <SquarePen size={22} strokeWidth={2} /> Perfil
            </button>
          </section>

          {/* resumen rápido */}
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

          {/* progreso 4 semanas */}
          <article className="de-tarjeta de-col-6">
            <h2 className="de-titulo">Progreso últimas 4 semanas</h2>
            <p className="de-variacion">
              {metricas.variacion === null ? (
                <span className="de-variacion--nulo">Sin datos para comparar</span>
              ) : (
                <>
                  <span className={metricas.variacion >= 0 ? 'de-variacion--sube' : 'de-variacion--baja'}>
                    <TrendingUp size={16} strokeWidth={2.4} className={metricas.variacion < 0 ? 'de-invertido' : ''} />
                    {' '}{Math.abs(metricas.variacion).toFixed(1)}%
                  </span>{' '}
                  vs. semana anterior
                </>
              )}
            </p>
            <div className="de-grafico">
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={metricas.serie} margin={{ top: 10, right: 16, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcdcdc" />
                  <XAxis dataKey="semana" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Rendimiento']} />
                  <Line type="linear" dataKey="valor" stroke="#d71920" strokeWidth={2}
                    dot={{ r: 5, fill: '#d71920', stroke: '#d71920' }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
              {!cargando && !metricas.hayProgreso && (
                <p className="de-grafico__vacio">Aún no hay evaluaciones registradas.</p>
              )}
            </div>
          </article>

          {/* lista de atletas */}
          <article className="de-tarjeta de-col-9">
            <div className="de-filtros">
              <label className="de-campo">
                <Search size={18} strokeWidth={2} />
                <input type="search" placeholder="Buscar atleta" value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)} />
              </label>
              <label className="de-campo">
                <Filter size={18} strokeWidth={2} />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={!tieneNivel}>
                  <option value="">Filtrar por categoría</option>
                  {base.niveles.map((n) => <option key={n.id} value={String(n.id)}>{n.nombre}</option>)}
                </select>
              </label>
            </div>

            <div className="de-lista-cabeza">
              <h2 className="de-titulo">Lista de Atletas</h2>
              <span className="de-contador">
                {cargando ? '…' : filtrados.length} {filtrados.length === 1 ? 'atleta' : 'atletas'}
              </span>
            </div>

            <div className="de-tabla-wrap">
              <table className="de-tabla">
                <thead>
                  <tr><th>Atleta</th><th>Categoría</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {visibles.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="de-atleta">
                          <span className="de-avatar">{a.nombre?.[0]?.toUpperCase() ?? '?'}</span>
                          <span>{a.nombre}</span>
                        </div>
                      </td>
                      <td><span className="de-nivel">{nombreNivel[String(a.id_nivel)] ?? 'Sin nivel'}</span></td>
                      <td>
                        <span className={`de-estado ${a.activo ? 'de-estado--activo' : 'de-estado--inactivo'}`}>
                          {a.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {cargando && <tr><td colSpan={3} className="de-vacio">Cargando atletas...</td></tr>}
                  {!cargando && filtrados.length === 0 && <tr><td colSpan={3} className="de-vacio">{textoVacio}</td></tr>}
                </tbody>
              </table>
            </div>

            <PieTabla
              pagina={paginaActual} totalPaginas={totalPaginas} total={filtrados.length}
              desde={inicio + 1} hasta={inicio + visibles.length} onCambiar={setPagina}
            />
          </article>

          {/* calendario */}
          <article className="de-tarjeta de-col-5">
            <h2 className="de-titulo de-titulo--icono"><Calendar size={24} strokeWidth={2} /> Calendario</h2>

            <div className="de-cal-nav">
              <button type="button" aria-label="Mes anterior" onClick={() => cambiarMes(-1)}><ChevronLeft size={18} /></button>
              <strong>{MESES[mes.getMonth()]}, {mes.getFullYear()}</strong>
              <button type="button" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}><ChevronRight size={18} /></button>
            </div>

            <div className={`de-cal ${cargandoCal ? 'de-cal--cargando' : ''}`} role="grid" aria-label="calendario de entrenamientos">
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
                    onClick={() => setDiaSel(f)}>
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

            <button type="button" className="de-btn-rojo de-btn-rojo--ancho" onClick={() => onNavigate(RUTA_ENTRENAMIENTOS)}>
              Ver mis entrenamientos
            </button>
          </article>

          {/* rendimiento del equipo */}
          <article className="de-tarjeta de-col-6">
            <h2 className="de-titulo">Rendimiento del Equipo</h2>
            <ul className="de-barras">
              {metricas.equipo.map((c) => (
                <li key={c.id}>
                  <div className="de-barras__fila">
                    <span>{c.nombre}</span>
                    <span>{cargando || c.valor === null ? '—' : `${c.valor}%`}</span>
                  </div>
                  <div className="de-barras__pista" role="progressbar" aria-valuemin={0} aria-valuemax={100}
                    aria-valuenow={c.valor ?? 0} aria-label={c.nombre}>
                    <div className="de-barras__relleno" style={{ width: `${c.valor ?? 0}%`, background: c.color }} />
                  </div>
                </li>
              ))}
            </ul>
            {!cargando && !metricas.hayProgreso && <p className="de-nota">Aún no hay evaluaciones registradas.</p>}
          </article>

        </div>
      </main>

      <AvisoToast aviso={aviso} />
    </>
  )
}