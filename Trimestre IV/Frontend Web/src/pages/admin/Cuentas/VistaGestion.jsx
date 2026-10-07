import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import PieTabla from './PieTabla.jsx'
import { ROLES, NOMBRE_ROL, fecha, coincide, paginar } from './cuentasData.js'

export default function VistaGestion({ usuarios, cargando, busqueda, onToggle, onCambiarRol }) {
  const [pagina, setPagina] = useState(1)
  useEffect(() => { setPagina(1) }, [busqueda])

  useEffect(() => {
    const cerrar = () => {
      if (document.activeElement?.tagName === 'SELECT') document.activeElement.blur()
    }
    window.addEventListener('resize', cerrar)
    return () => window.removeEventListener('resize', cerrar)
  }, [])

  const aprobadas = usuarios.filter((u) => u.estado === 'aprobada')
  const gestion = aprobadas.filter((u) => coincide(u, busqueda))
  const totalActivas = aprobadas.filter((u) => u.activo).length
  const pag = paginar(gestion, pagina)

  return (
    <div>
      <div className="gestion-encabezado">
        <div className="gestion-stats">
          <div className="stat-badge stat-badge--azul"><Users size={14} /> {aprobadas.length} Usuarios totales</div>
          <div className="stat-badge stat-badge--verde"><Users size={14} /> {totalActivas} Usuarios activos</div>
          <div className="stat-badge stat-badge--rojo"><Users size={14} /> {aprobadas.length - totalActivas} Usuarios inactivos</div>
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
            {pag.visibles.map((u) => (
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
                  <select
                    className={`badge badge--${u.rol === 'entrenador' ? 'amarillo' : 'azul'} select-rol`}
                    value={u.rol}
                    aria-label={`Rol de ${u.nombre}`}
                    onChange={(e) => onCambiarRol(u, e.target.value)}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{NOMBRE_ROL[r]}</option>)}
                  </select>
                </td>
                <td>
                  <span className={`badge badge--${u.activo ? 'verde' : 'rojo'}`}>
                    {u.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td><span className="fecha-celda">{fecha(u.created_at)}</span></td>
                <td className="acciones-celda">
                  <label className="toggle">
                    <input type="checkbox" checked={u.activo} onChange={() => onToggle(u)} />
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

      <PieTabla p={pag} onCambiar={setPagina} />
    </div>
  )
}