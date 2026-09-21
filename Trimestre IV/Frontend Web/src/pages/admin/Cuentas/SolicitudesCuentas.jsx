import { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header.jsx'
import Sidebar from '../../../components/Sidebar/Sidebar.jsx'
import menuAdmin from '../../../data/menuAdmin.js'
import { supabase } from '../../../services/supabase'
import { llamarAdmin as llamar, cargarUsuarios } from '../../../services/adminUsuarios'
import AvisoToast from '../../../components/AvisoToast'
import useAviso from '../../../hooks/useAviso'
import './SolicitudCuentas.css' // tu CSS, en esta misma carpeta

const FILAS_POR_PAGINA = 5
const TABS = { pendiente: 'Pendientes', aprobada: 'Aprobadas', rechazada: 'Rechazadas' }
const BADGE_ESTADO = { pendiente: 'amarillo', aprobada: 'verde', rechazada: 'rojo' }
const NOMBRE_ROL = { atleta: 'Atleta', entrenador: 'Entrenador' }
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO')

// Textos de cada confirmación + mensaje y tipo del toast de éxito
// tipo: 'ok' | 'advertencia' | 'error'  (clases aviso-ok, aviso-advertencia, aviso-error)
const ACCIONES = {
  aprobar: {
    titulo: '¿Aprobar solicitud?',
    desc: (n) => `${n} podrá iniciar sesión en el sistema. ¿Confirmas la aprobación?`,
    boton: 'Sí, aprobar', clase: 'btn-verde',
    exito: 'Solicitud aprobada',
    tipo: 'ok',
  },
  rechazar: {
    titulo: '¿Rechazar solicitud?',
    desc: (n) => `La solicitud de ${n} será rechazada. ¿Confirmas el rechazo?`,
    boton: 'Sí, rechazar', clase: 'btn-primario',
    exito: 'Solicitud rechazada',
    tipo: 'error',
  },
  activar: {
    titulo: '¿Activar cuenta?',
    desc: () => 'El usuario podrá volver a ingresar al sistema. ¿Confirmas la activación?',
    boton: 'Sí, activar', clase: 'btn-verde',
    exito: 'Cuenta activada',
    tipo: 'ok',
  },
  desactivar: {
    titulo: '¿Desactivar cuenta?',
    desc: () => 'El usuario perderá acceso al sistema hasta ser reactivado. ¿Confirmas la desactivación?',
    boton: 'Sí, desactivar', clase: 'btn-primario',
    exito: 'Cuenta desactivada',
    tipo: 'advertencia',
  },
}

const Svg = ({ children, size = 15, sw = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)
const IconoOjo = () => <Svg><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Svg>
const IconoCheck = () => <Svg sw={2.5}><path d="m5 12 5 5L20 7"/></Svg>
const IconoX = ({ size }) => <Svg size={size} sw={2.5}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Svg>
const IconoChevron = ({ dir }) => <Svg size={18} sw={2.2}><path d={dir === 'izq' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}/></Svg>

// Paginación (máx. FILAS_POR_PAGINA filas visibles), todo en este mismo archivo
const paginar = (lista, pagina) => {
  const total = lista.length
  const totalPaginas = Math.max(1, Math.ceil(total / FILAS_POR_PAGINA))
  const actual = Math.min(pagina, totalPaginas)
  const inicio = (actual - 1) * FILAS_POR_PAGINA
  return { visibles: lista.slice(inicio, inicio + FILAS_POR_PAGINA), actual, totalPaginas, total, inicio }
}

// Pie de tabla: solo aparece si hay más filas de las que caben en una página
function PieTabla({ p, onCambiar }) {
  if (p.total <= FILAS_POR_PAGINA) return null
  return (
    <footer className="cuentas-pie">
      <span>Mostrando {p.inicio + 1}–{p.inicio + p.visibles.length} de {p.total}</span>
      <div className="cuentas-paginador" role="group" aria-label="paginación de la tabla">
        <button type="button" aria-label="Página anterior"
          disabled={p.actual === 1} onClick={() => onCambiar(p.actual - 1)}>
          <IconoChevron dir="izq" />
        </button>
        <span className="cuentas-paginador__indicador">{p.actual} / {p.totalPaginas}</span>
        <button type="button" aria-label="Página siguiente"
          disabled={p.actual >= p.totalPaginas} onClick={() => onCambiar(p.actual + 1)}>
          <IconoChevron dir="der" />
        </button>
      </div>
    </footer>
  )
}

const IconoUsuarios = ({ size = 15 }) => (
  <Svg size={size}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>
)

export default function SolicitudesCuentas() {
  const { aviso, mostrarAviso } = useAviso()

  // La vista vive en la URL (?vista=gestion). Así entrar a gestión crea una
  // entrada en el historial y la flecha "atrás" vuelve a solicitudes
  // en lugar de saltar al dashboard.
  const leerVista = () => new URLSearchParams(window.location.search).get('vista') === 'gestion'
  const [esGestion, setEsGestion] = useState(leerVista)

  const [usuarios, setUsuarios] = useState([])
  const [tab, setTab] = useState('pendiente')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [detalle, setDetalle] = useState(null)
  const [confirmar, setConfirmar] = useState(null) // { usuario, accion }

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

  // Flechas atrás/adelante del navegador: sincroniza la vista con la URL
  useEffect(() => {
    const onPop = () => setEsGestion(leerVista())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Al cambiar de vista (botón, flecha atrás o adelante) se limpia la búsqueda
  useEffect(() => { setBusqueda('') }, [esGestion])

  const alternarVista = () => {
    if (!esGestion) {
      window.history.pushState({ vista: 'gestion' }, '', `${window.location.pathname}?vista=gestion`)
      setEsGestion(true)
    } else if (window.history.state?.vista === 'gestion') {
      window.history.back() // deshace el push; popstate actualiza la vista
    } else {
      // entraste directo a ?vista=gestion: no hay nada a qué volver, solo cambia la URL
      window.history.replaceState({}, '', window.location.pathname)
      setEsGestion(false)
    }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/acceso'
  }
  const irAInicio = () => { window.location.href = '/' }

  // Si llegas desde el dashboard con ?ver=<id>, abre el modal de esa solicitud
  useEffect(() => {
    if (cargando) return
    const id = new URLSearchParams(window.location.search).get('ver')
    if (!id) return
    const u = usuarios.find((x) => x.id === id)
    if (u) { setTab(u.estado); setDetalle(u) }
    window.history.replaceState({}, '', window.location.pathname) // limpia la URL
  }, [cargando, usuarios])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setDetalle(null); setConfirmar(null) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const ejecutar = async () => {
    const { usuario, accion } = confirmar
    try {
      if (accion === 'aprobar' || accion === 'rechazar') {
        await llamar({
          accion: 'cambiar-estado', id: usuario.id,
          estado: accion === 'aprobar' ? 'aprobada' : 'rechazada',
        })
      } else {
        await llamar({ accion: 'cambiar-activo', id: usuario.id, activo: accion === 'activar' })
      }
      setConfirmar(null)
      mostrarAviso(ACCIONES[accion].exito, ACCIONES[accion].tipo) // toast de éxito
      cargar()
    } catch (e) {
      setConfirmar(null)
      mostrarAviso(e.message, 'error')
    }
  }

  const coincide = (u) =>
    `${u.nombre} ${u.email}`.toLowerCase().includes(busqueda.toLowerCase())

  // Vista solicitudes
  const filtradas = usuarios.filter((u) => u.estado === tab && coincide(u))
  const conteo = usuarios.filter((u) => u.estado === tab).length
  const colorConteo = tab === 'pendiente' ? 'azul' : tab === 'aprobada' ? 'verde' : 'rojo'

  // Vista gestión (solo cuentas aprobadas)
  const aprobadas = usuarios.filter((u) => u.estado === 'aprobada')
  const gestion = aprobadas.filter(coincide)
  const totalActivas = aprobadas.filter((u) => u.activo).length

  // Paginación (5 filas por página), una por cada tabla
  const [paginaSol, setPaginaSol] = useState(1)
  const [paginaGes, setPaginaGes] = useState(1)
  const pagSol = paginar(filtradas, paginaSol)
  const pagGes = paginar(gestion, paginaGes)

  // Al cambiar de pestaña o de búsqueda se vuelve a la página 1
  useEffect(() => { setPaginaSol(1) }, [tab, busqueda])
  useEffect(() => { setPaginaGes(1) }, [busqueda])

  const contenido = (
    <main className="admin-main">
      <div className="contenedor">
        <section className="pagina-encabezado">
          <h1>{esGestion ? 'Gestión de cuentas' : 'Solicitudes de nuevas cuentas'}</h1>
          <p className="pagina-subtitulo">
            {esGestion
              ? 'Activa o desactiva el acceso de los miembros registrados en el club.'
              : 'Gestiona las solicitudes de ingreso de atletas y entrenadores nuevos del club.'}
          </p>
        </section>

        <div className="acciones-barra">
          <div className="buscar-wrap">
            <Svg><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Svg>
            <input
              type="text"
              placeholder={esGestion ? 'Buscar usuario' : 'Buscar solicitud'}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="acciones-btns">
            <button
              className={`btn ${esGestion ? 'btn-azul' : 'btn-amarillo'}`}
              onClick={alternarVista}
            >
              <IconoUsuarios /> {esGestion ? 'Validar cuentas' : 'Gestionar cuentas'}
            </button>
          </div>
        </div>

        {/* ───────── Vista solicitudes ───────── */}
        {!esGestion && (
          <div>
            <div className="tabs-barra">
              <div className="tabs-grupo">
                {Object.entries(TABS).map(([clave, texto]) => (
                  <button key={clave}
                    className={`tab-btn ${tab === clave ? 'tab-btn--activo' : ''}`}
                    onClick={() => setTab(clave)}>
                    {texto}
                  </button>
                ))}
              </div>
              <div className={`conteo-badge conteo-badge--${colorConteo}`}>
                {conteo} Solicitudes {TABS[tab].toLowerCase()}
              </div>
            </div>

            <div className="tabla-wrap">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th><th>Nombre</th><th>Contacto</th><th>Rol</th>
                    <th>Estado</th><th>Fecha registro</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagSol.visibles.map((u) => (
                    <tr key={u.id}>
                      <td><span className="id-celda">{u.codigo}</span></td>
                      <td><span className="nombre-celda">{u.nombre}</span></td>
                      <td><span className="correo-celda">{u.email}</span></td>
                      <td>
                        <span className={`badge badge--${u.rol === 'entrenador' ? 'amarillo' : 'azul'}`}>
                          {NOMBRE_ROL[u.rol]}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge--${BADGE_ESTADO[u.estado]}`}>
                          {u.estado[0].toUpperCase() + u.estado.slice(1)}
                        </span>
                      </td>
                      <td><span className="fecha-celda">{fecha(u.created_at)}</span></td>
                      <td className="acciones-celda">
                        <button className="btn-accion btn-accion--ojo" title="Ver detalles" onClick={() => setDetalle(u)}>
                          <IconoOjo />
                        </button>
                        {u.estado === 'pendiente' && (
                          <>
                            <button className="btn-accion btn-accion--check" title="Aprobar"
                              onClick={() => setConfirmar({ usuario: u, accion: 'aprobar' })}>
                              <IconoCheck />
                            </button>
                            <button className="btn-accion btn-accion--x" title="Rechazar"
                              onClick={() => setConfirmar({ usuario: u, accion: 'rechazar' })}>
                              <IconoX />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {cargando && <tr><td colSpan="7" className="tabla-vacia">Cargando solicitudes...</td></tr>}
                  {!cargando && filtradas.length === 0 && (
                    <tr><td colSpan="7" className="tabla-vacia">No hay solicitudes en esta categoría.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <PieTabla p={pagSol} onCambiar={setPaginaSol} />
          </div>
        )}

        {/* ───────── Vista gestión de cuentas ───────── */}
        {esGestion && (
          <div>
            <div className="gestion-encabezado">
              <div className="gestion-stats">
                <div className="stat-badge stat-badge--azul"><IconoUsuarios size={14} /> {aprobadas.length} Usuarios totales</div>
                <div className="stat-badge stat-badge--verde"><IconoUsuarios size={14} /> {totalActivas} Usuarios activos</div>
                <div className="stat-badge stat-badge--rojo"><IconoUsuarios size={14} /> {aprobadas.length - totalActivas} Usuarios inactivos</div>
              </div>
            </div>

            <div className="tabla-wrap">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th>
                    <th>Estado</th><th>Fecha registro</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagGes.visibles.map((u) => (
                    <tr key={u.id}>
                      <td><span className="id-celda">{u.codigo}</span></td>
                      <td>
                        <div className="nombre-con-avatar">
                          <div className="avatar-inicial">{u.nombre?.[0]?.toUpperCase() ?? '?'}</div>
                          <span className="nombre-celda">{u.nombre}</span>
                        </div>
                      </td>
                      <td><span className="correo-celda">{u.email}</span></td>
                      <td>
                        <span className={`badge badge--${u.rol === 'entrenador' ? 'amarillo' : 'azul'}`}>
                          {NOMBRE_ROL[u.rol]}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge--${u.activo ? 'verde' : 'rojo'}`}>
                          {u.activo ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td><span className="fecha-celda">{fecha(u.created_at)}</span></td>
                      <td className="acciones-celda">
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={u.activo}
                            onChange={() => setConfirmar({ usuario: u, accion: u.activo ? 'desactivar' : 'activar' })}
                          />
                          <span className="toggle__pista"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                  {!cargando && gestion.length === 0 && (
                    <tr><td colSpan="7" className="tabla-vacia">No hay cuentas aprobadas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <PieTabla p={pagGes} onCambiar={setPaginaGes} />
          </div>
        )}
      </div>

      {/* ───────── Modal ojito: 3 campos del registro ───────── */}
      {detalle && (
        <div className="modal-overlay modal-overlay--scroll"
          onClick={(e) => e.target === e.currentTarget && setDetalle(null)}>
          <div className="modal-dialogo modal--detalles" role="dialog" aria-modal="true">
            <div className="modal-cabeza">
              <h2 className="modal-cabeza__titulo">Detalles de la solicitud</h2>
              <button className="modal-cerrar" onClick={() => setDetalle(null)}><IconoX size={20} /></button>
            </div>
            <div className="modal-cuerpo">
              <div className="detalle-titulo-seccion detalle-titulo-seccion--inicio">
                <Svg size={14}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>
                Datos del registro
              </div>
              <div className="detalle-grid">
                <div className="detalle-grupo">
                  <label>Rol</label>
                  <div className="detalle-rol">
                    <span className={`insignia-rol insignia-rol--tabla insignia-rol--${detalle.rol}`}>
                      {NOMBRE_ROL[detalle.rol]}
                    </span>
                  </div>
                </div>
                <div className="detalle-grupo">
                  <label>Nombre</label>
                  <input type="text" readOnly value={detalle.nombre} />
                </div>
                <div className="detalle-grupo detalle-grupo--full">
                  <label>Correo electrónico</label>
                  <input type="text" readOnly value={detalle.email} />
                </div>
              </div>
            </div>
            {detalle.estado === 'pendiente' && (
              <div className="modal-pie">
                <button className="btn btn-primario"
                  onClick={() => { setConfirmar({ usuario: detalle, accion: 'rechazar' }); setDetalle(null) }}>
                  Rechazar
                </button>
                <button className="btn btn-verde"
                  onClick={() => { setConfirmar({ usuario: detalle, accion: 'aprobar' }); setDetalle(null) }}>
                  Aprobar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────── Modal de confirmación ───────── */}
      {confirmar && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmar(null)}>
          <div className="modal-dialogo modal--chico" role="dialog" aria-modal="true">
            <div className="modal-cabeza modal-cabeza--simple">
              <h2 className="modal-titulo">{ACCIONES[confirmar.accion].titulo}</h2>
              <button className="modal-cerrar" onClick={() => setConfirmar(null)}><IconoX size={20} /></button>
            </div>
            <p className="modal-descripcion">{ACCIONES[confirmar.accion].desc(confirmar.usuario.nombre)}</p>
            <div className="modal-pie">
              <button className="btn btn-blanco" onClick={() => setConfirmar(null)}>Cancelar</button>
              <button className={`btn ${ACCIONES[confirmar.accion].clase}`} onClick={ejecutar}>
                {ACCIONES[confirmar.accion].boton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast (reemplaza al modal de éxito) */}
      <AvisoToast aviso={aviso} />
    </main>
  )

  // Misma estructura que DashboardAdmin (Sidebar + Header + main)
  return (
    <div className="dashboard">
      <Sidebar
        items={menuAdmin}
        activeHref="/admin/usuarios"
        onNavigate={(href) => (window.location.href = href)}
      />

      <div className="dashboard__contenido">
        <Header rol="Administrador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />
        {contenido}
      </div>
    </div>
  )
}