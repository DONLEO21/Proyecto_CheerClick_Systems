import { useEffect, useState } from 'react'
import { Eye, Check, X } from 'lucide-react'
import PieTabla from './PieTabla.jsx'
import { TABS, BADGE_ESTADO, NOMBRE_ROL, fecha, coincide, paginar } from './cuentasData.js'

const COLOR_CONTEO = { pendiente: 'azul', aprobada: 'verde', rechazada: 'rojo' }

export default function VistaSolicitudes({ usuarios, cargando, tab, onTab, busqueda, onVer, onAccion }) {
  const [pagina, setPagina] = useState(1)
  useEffect(() => { setPagina(1) }, [tab, busqueda])

  const delTab = usuarios.filter((u) => u.estado === tab)
  const filtradas = delTab.filter((u) => coincide(u, busqueda))
  const pag = paginar(filtradas, pagina)

  return (
    <div>
      <div className="tabs-barra">
        <div className="tabs-grupo">
          {Object.entries(TABS).map(([clave, texto]) => (
            <button key={clave}
              className={`tab-btn ${tab === clave ? 'tab-btn--activo' : ''}`}
              onClick={() => onTab(clave)}>
              {texto}
            </button>
          ))}
        </div>
        <div className={`conteo-badge conteo-badge--${COLOR_CONTEO[tab]}`}>
          {delTab.length} Solicitudes {TABS[tab].toLowerCase()}
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
            {pag.visibles.map((u) => (
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
                  <button className="btn-accion btn-accion--ojo" title="Ver detalles" onClick={() => onVer(u)}>
                    <Eye size={15} strokeWidth={2} />
                  </button>
                  {u.estado === 'pendiente' && (
                    <>
                      <button className="btn-accion btn-accion--check" title="Aprobar" onClick={() => onAccion(u, 'aprobar')}>
                        <Check size={15} strokeWidth={2.5} />
                      </button>
                      <button className="btn-accion btn-accion--x" title="Rechazar" onClick={() => onAccion(u, 'rechazar')}>
                        <X size={15} strokeWidth={2.5} />
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

      <PieTabla p={pag} onCambiar={setPagina} />
    </div>
  )
}