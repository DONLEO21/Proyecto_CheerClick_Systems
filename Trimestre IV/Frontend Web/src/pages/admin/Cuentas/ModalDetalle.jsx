import { X, User, FileText } from 'lucide-react'
import {
  NOMBRE_ROL, NOMBRE_GENERO, NOMBRE_TIPO_DOC, NOMBRE_EPS,
  val, fechaVal, parentescoLegible,
} from './cuentasData.js'

function Campo({ etiqueta, children, completo }) {
  return (
    <div className={`detalle-grupo ${completo ? 'detalle-grupo--full' : ''}`}>
      <label>{etiqueta}</label>
      <div className="detalle-valor">{children}</div>
    </div>
  )
}

function SeccionPerfil({ perfil }) {
  const contactos = Array.isArray(perfil.contactos) ? perfil.contactos : []
  const nombreCert = val(perfil.certificado_eps_nombre)

  return (
    <>
      <div className="detalle-titulo-seccion">
        <User size={14} strokeWidth={2} />
        Información del perfil
      </div>
      <div className="detalle-grid">
        <Campo etiqueta="Tipo de documento">{val(NOMBRE_TIPO_DOC[perfil.tipo_documento])}</Campo>
        <Campo etiqueta="Número de documento">{val(perfil.numero_documento)}</Campo>
        <Campo etiqueta="Género">{val(NOMBRE_GENERO[perfil.genero])}</Campo>
        <Campo etiqueta="Fecha de nacimiento">{fechaVal(perfil.fecha_nacimiento)}</Campo>
        <Campo etiqueta="Teléfono">{val(perfil.telefono)}</Campo>
        <Campo etiqueta="EPS">{val(NOMBRE_EPS[perfil.eps] ?? perfil.eps)}</Campo>
        <div className="detalle-grupo detalle-grupo--full">
          <label>Certificado de EPS</label>
          <div className="detalle-valor detalle-valor--archivo">
            <FileText size={14} strokeWidth={2} />
            {perfil.certificado_eps_url_firmada ? (
              <a href={perfil.certificado_eps_url_firmada} target="_blank" rel="noopener noreferrer"
                className="detalle-archivo-enlace">
                {nombreCert !== '—' ? nombreCert : 'Ver certificado'}
              </a>
            ) : (
              <span>{nombreCert}</span>
            )}
          </div>
        </div>
      </div>

      {contactos.length > 0 && (
        <>
          <div className="detalle-titulo-seccion">Contactos de emergencia</div>
          {contactos.map((c, i) => (
            <div key={i} className="detalle-contacto-bloque">
              <p className="detalle-contacto-nombre">Contacto {i + 1}</p>
              <div className="detalle-grid">
                <Campo etiqueta="Nombre">{val(c.nombre)}</Campo>
                <Campo etiqueta="Apellido">{val(c.apellido)}</Campo>
                <Campo etiqueta="Teléfono">{val(c.telefono)}</Campo>
                {c.parentesco && <Campo etiqueta="Parentesco">{parentescoLegible(c.parentesco)}</Campo>}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default function ModalDetalle({ detalle, perfil, cargandoPerfil, onCerrar, onAccion }) {
  return (
    <div className="modal-overlay modal-overlay--scroll"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="modal-dialogo modal--detalles" role="dialog" aria-modal="true">
        <div className="modal-cabeza">
          <h2 className="modal-cabeza__titulo">Detalles de la solicitud</h2>
          <button className="modal-cerrar" onClick={onCerrar}><X size={20} strokeWidth={2.5} /></button>
        </div>

        <div className="modal-cuerpo">
          <div className="detalle-titulo-seccion detalle-titulo-seccion--inicio">
            <User size={14} strokeWidth={2} />
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
            <Campo etiqueta="Nombre">{val(detalle.nombre)}</Campo>
            <Campo etiqueta="Correo electrónico" completo>{val(detalle.email)}</Campo>
          </div>

          {/* el perfil solo existe para cuentas aprobadas */}
          {detalle.estado === 'aprobada' && (
            <>
              {cargandoPerfil && <p className="perfil-modal-descripcion">Cargando información del perfil…</p>}
              {!cargandoPerfil && perfil && <SeccionPerfil perfil={perfil} />}
              {!cargandoPerfil && !perfil && (
                <p className="perfil-modal-descripcion">Este usuario aún no ha completado su perfil.</p>
              )}
            </>
          )}
        </div>

        {detalle.estado === 'pendiente' && (
          <div className="modal-pie">
            <button className="btn btn-primario" onClick={() => onAccion(detalle, 'rechazar')}>Rechazar</button>
            <button className="btn btn-verde" onClick={() => onAccion(detalle, 'aprobar')}>Aprobar</button>
          </div>
        )}
      </div>
    </div>
  )
}