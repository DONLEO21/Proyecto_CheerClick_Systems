import { useEffect, useState } from 'react'
import { llamarAdmin as llamar, cargarUsuarios, obtenerDetalleUsuario } from '../../../services/adminUsuarios'
import { ACCIONES } from './cuentasData.js'

const leerVista = () => new URLSearchParams(window.location.search).get('vista') === 'gestion'

export default function useCuentas(mostrarAviso) {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState('pendiente')
  const [esGestion, setEsGestion] = useState(leerVista)
  const [detalle, setDetalle] = useState(null)
  const [perfilDetalle, setPerfilDetalle] = useState(null) // tabla `perfiles`, solo cuentas aprobadas
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [confirmar, setConfirmar] = useState(null) // { usuario, accion, rol? }

  const cargar = async () => {
    try {
      setUsuarios(await cargarUsuarios())
    } catch (e) {
      mostrarAviso(e.message, 'error')
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => { cargar() }, [])

  /* ── vista (solicitudes / gestión) sincronizada con la URL ── */
  useEffect(() => {
    const onPop = () => setEsGestion(leerVista())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const alternarVista = () => {
    if (!esGestion) {
      window.history.pushState({ vista: 'gestion' }, '', `${window.location.pathname}?vista=gestion`)
      setEsGestion(true)
    } else if (window.history.state?.vista === 'gestion') {
      window.history.back()
    } else {
      window.history.replaceState({}, '', window.location.pathname)
      setEsGestion(false)
    }
  }

  /* ── detalle ── */
  const abrirDetalle = async (u) => {
    setDetalle(u)
    setPerfilDetalle(null)
    if (u.estado !== 'aprobada') return
    setCargandoDetalle(true)
    try {
      const { perfil } = await obtenerDetalleUsuario(u.id)
      setPerfilDetalle(perfil) // null si nunca editó su perfil
    } catch (e) {
      mostrarAviso(e.message, 'error')
    } finally {
      setCargandoDetalle(false)
    }
  }
  const cerrarDetalle = () => setDetalle(null)

  // Abre el detalle de ?ver=<id> (viene del dashboard)
  useEffect(() => {
    if (cargando) return
    const id = new URLSearchParams(window.location.search).get('ver')
    if (!id) return
    const u = usuarios.find((x) => x.id === id)
    if (u) { setTab(u.estado); abrirDetalle(u) }
    window.history.replaceState({}, '', window.location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargando, usuarios])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setDetalle(null); setConfirmar(null) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* ── confirmación y ejecución de acciones ── */
  const pedirConfirmacion = (usuario, accion, extra = {}) => setConfirmar({ usuario, accion, ...extra })
  const cancelarConfirmacion = () => setConfirmar(null)

  const ejecutar = async () => {
    const { usuario, accion, rol } = confirmar
    try {
      if (accion === 'aprobar' || accion === 'rechazar') {
        await llamar({ accion: 'cambiar-estado', id: usuario.id, estado: accion === 'aprobar' ? 'aprobada' : 'rechazada' })
      } else if (accion === 'cambiar-rol') {
        await llamar({ accion: 'cambiar-rol', id: usuario.id, rol })
      } else {
        await llamar({ accion: 'cambiar-activo', id: usuario.id, activo: accion === 'activar' })
      }
      setConfirmar(null)
      mostrarAviso(ACCIONES[accion].exito, ACCIONES[accion].tipo)
      cargar()
    } catch (e) {
      setConfirmar(null)
      mostrarAviso(e.message, 'error')
    }
  }

  return {
    usuarios, cargando, tab, setTab, esGestion, alternarVista,
    detalle, perfilDetalle, cargandoDetalle, abrirDetalle, cerrarDetalle,
    confirmar, pedirConfirmacion, cancelarConfirmacion, ejecutar,
  }
}