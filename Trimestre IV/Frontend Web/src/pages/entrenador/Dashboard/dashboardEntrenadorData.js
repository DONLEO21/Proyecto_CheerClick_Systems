import { supabase } from '../../../services/supabase'

/* ───────── configuración ───────── */
const DB = {
  usuarios: 'usuarios',
  niveles: 'niveles',
  entrenamientos: 'entrenamientos',
  asistencias: 'asistencias',
  evaluaciones: 'evaluaciones',
}

export const RUTA_PERFIL = '/entrenador/perfil'
export const RUTA_ENTRENAMIENTOS = '/entrenador/entrenamientos'
export const RUTA_INICIO_ENTRENADOR = '/entrenador'

export const USAR_DATOS_DEMO = false // true = datos de ejemplo siempre
export const DEMO_SI_NO_HAY_NIVEL = true
export const MAX_ITEMS = 3 // atletas por página

// Los id deben coincidir con las columnas de `evaluaciones` en Supabase
export const CATEGORIAS = [
  { id: 'apropiada', nombre: 'Apropiada', color: '#a847e0' },
  { id: 'avanzada', nombre: 'Avanzada', color: '#f8df3e' },
  { id: 'elite', nombre: 'Elite', color: '#2f80ed' },
]

// Valores temporales mientras no existan evaluaciones registradas
const EQUIPO_DEMO = { apropiada: 79, avanzada: 83, elite: 65 }
const SERIE_DEMO = [62, 68, 74, 76]
const RENDIMIENTO_DEMO = 76

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

/* ───────── utilidades ───────── */
export const pad = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const hace = (dias) => { const d = new Date(); d.setDate(d.getDate() - dias); return d }
export const dia10 = (f) => String(f).slice(0, 10)
const prom = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null)
const notaEval = (e) =>
  prom(CATEGORIAS.map((c) => Number(e[c.id])).filter((n) => Number.isFinite(n)))

export const hora12 = (h) => {
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

export async function cargarBase(uid) {
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
      t.select('fecha,apropiada,avanzada,elite').in('id_nivel', ids).gte('fecha', iso(hace(27)))),
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

export function obtenerEntrenos({ demo, niveles, desde, hasta }) {
  return demo
    ? Promise.resolve(demoEntrenos(desde, hasta, niveles))
    : cargarEntrenos(niveles.map((n) => n.id), desde, hasta)
}

/* ───────── métricas ───────── */
export function calcularMetricas(evals, asist) {
  const esDemo = evals.length === 0

  const notas = evals.map(notaEval).filter((n) => n !== null)
  const rendimiento = notas.length ? Math.round(prom(notas)) : (esDemo ? RENDIMIENTO_DEMO : null)

  // 4 semanas, la más antigua primero
  const serie = esDemo
    ? SERIE_DEMO.map((v, i) => ({ semana: `Sem ${i + 1}`, valor: v }))
    : [0, 1, 2, 3].map((i) => {
        const desde = iso(hace(7 * (4 - i) - 1))
        const hasta = iso(hace(7 * (3 - i)))
        const v = evals
          .filter((e) => dia10(e.fecha) >= desde && dia10(e.fecha) <= hasta)
          .map(notaEval).filter((n) => n !== null)
        return { semana: `Sem ${i + 1}`, valor: v.length ? Math.round(prom(v)) : null }
      })
  const [previa, actual] = [serie[2].valor, serie[3].valor]
  const variacion = previa && actual !== null ? ((actual - previa) / previa) * 100 : null

  const asistencia = asist.length
    ? Math.round((asist.filter((a) => a.presente).length * 100) / asist.length)
    : null

  const equipo = CATEGORIAS.map((c) => {
    const v = evals.map((e) => Number(e[c.id])).filter((n) => Number.isFinite(n))
    const valor = v.length ? Math.round(prom(v)) : (esDemo ? EQUIPO_DEMO[c.id] : null)
    return { ...c, valor }
  })

  return { rendimiento, serie, variacion, asistencia, equipo, esDemo }
}

/* ───────── datos de ejemplo ───────── */
export const DEMO_BASE = (() => {
  const nombres = ['Ana López', 'Juan Pérez', 'Gabriela Deaquiz', 'Camila Rojas', 'Mateo Díaz', 'Valentina Cruz', 'Samuel Ortiz', 'Laura Gómez']
  const niveles = [{ id: 1, nombre: 'Nivel 3 Magic' }, { id: 2, nombre: 'Nivel 2 Elite' }]
  const atletas = nombres.map((n, i) => ({
    id: `demo-${i}`, codigo: `AT${100 + i}`, nombre: n,
    activo: i !== 2 && i !== 6, id_nivel: i % 3 === 2 ? 2 : 1,
  }))
  const evals = [62, 68, 74, 80].map((b, w) => ({
    fecha: iso(hace(3 + 7 * (3 - w))),
    apropiada: b + 8, avanzada: b + 12, elite: b - 6,
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
    if (n % 4 === 0) {
      sesiones.push({ tipo: TIPOS_ENTRENO[(n + 1) % 3], nivel: niveles[(n + 1) % niveles.length], ini: '19:30:00', fin: '21:00:00' })
    }
    sesiones.forEach((x, idx) => out.push({
      id: `${iso(d)}-${idx}`, id_nivel: x.nivel.id, titulo: x.tipo,
      fecha: iso(d), hora_inicio: x.ini, hora_fin: x.fin,
    }))
  }
  return out
}