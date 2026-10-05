import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../services/supabase'
import {
  USAR_DATOS_DEMO, DEMO_SI_NO_HAY_NIVEL, DEMO_BASE,
  iso, dia10, cargarBase, obtenerEntrenos, calcularMetricas,
} from './dashboardEntrenadorData.js'

export default function useDashboardEntrenador(mostrarAviso) {
  const hoy = iso(new Date())

  /* ── datos base ── */
  const [base, setBase] = useState({ niveles: [], atletas: [], evals: [], asist: [], errores: [] })
  const [cargando, setCargando] = useState(true)
  const [demo, setDemo] = useState(USAR_DATOS_DEMO)

  useEffect(() => {
    let vivo = true
    const usarDemo = () => { setBase(DEMO_BASE); setDemo(true) }

    const cargar = async () => {
      if (USAR_DATOS_DEMO) return DEMO_BASE
      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) throw new Error('No hay una sesión activa.')
      return cargarBase(uid)
    }

    cargar()
      .then((b) => {
        if (!vivo) return
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

  const clavesNivel = base.niveles.map((n) => n.id).join(',')
  const nombreNivel = useMemo(
    () => Object.fromEntries(base.niveles.map((n) => [String(n.id), n.nombre])),
    [base.niveles]
  )
  const tieneNivel = base.niveles.length > 0

  /* ── calendario ── */
  const [mes, setMes] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [entrenos, setEntrenos] = useState([])
  const [cargandoCal, setCargandoCal] = useState(false)
  const [diaSel, setDiaSel] = useState(hoy)
  const mesClave = `${mes.getFullYear()}-${mes.getMonth()}`

  useEffect(() => {
    if (cargando) return
    let vivo = true
    setCargandoCal(true)
    obtenerEntrenos({
      demo, niveles: base.niveles,
      desde: iso(mes),
      hasta: iso(new Date(mes.getFullYear(), mes.getMonth() + 1, 0)),
    })
      .then((r) => vivo && setEntrenos(r))
      .catch((e) => { if (vivo) { setEntrenos([]); mostrarAviso(e.message, 'error') } })
      .finally(() => vivo && setCargandoCal(false))
    return () => { vivo = false }
  }, [mesClave, cargando, clavesNivel, demo])

  const porDia = useMemo(() => {
    const m = {}
    entrenos.forEach((e) => {
      const f = dia10(e.fecha)
      if (!m[f]) m[f] = []
      m[f].push(e)
    })
    return m
  }, [entrenos])

  const cambiarMes = (delta) => setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1))

  /* ── entrenamientos de hoy ── */
  const [entrenosHoy, setEntrenosHoy] = useState(null)

  useEffect(() => {
    if (cargando) return
    let vivo = true
    obtenerEntrenos({ demo, niveles: base.niveles, desde: hoy, hasta: hoy })
      .then((r) => vivo && setEntrenosHoy(r.length))
      .catch(() => vivo && setEntrenosHoy(null))
    return () => { vivo = false }
  }, [cargando, clavesNivel, demo])

  /* ── métricas ── */
  const metricas = useMemo(() => calcularMetricas(base.evals, base.asist), [base.evals, base.asist])
  const atletasActivos = base.atletas.filter((a) => a.activo).length

  return {
    base, cargando, hoy, nombreNivel, tieneNivel, metricas, atletasActivos, entrenosHoy,
    calendario: { mes, cambiarMes, porDia, cargando: cargandoCal, diaSel, setDiaSel },
  }
}