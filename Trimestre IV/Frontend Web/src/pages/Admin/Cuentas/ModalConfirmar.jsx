import { X } from 'lucide-react'
import { ACCIONES } from './cuentasData.js'

export default function ModalConfirmar({ confirmar, onCancelar, onConfirmar }) {
  const { usuario, accion, rol } = confirmar
  const a = ACCIONES[accion]

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancelar()}>
      <div className="modal-dialogo modal--chico" role="dialog" aria-modal="true">
        <div className="modal-cabeza modal-cabeza--simple">
          <h2 className="modal-titulo">{a.titulo}</h2>
          <button className="modal-cerrar" onClick={onCancelar}><X size={20} strokeWidth={2.5} /></button>
        </div>
        <p className="modal-descripcion">{a.desc(usuario.nombre, rol)}</p>
        <div className="modal-pie">
          <button className="btn btn-blanco" onClick={onCancelar}>Cancelar</button>
          <button className={`btn ${a.clase}`} onClick={onConfirmar}>{a.boton}</button>
        </div>
      </div>
    </div>
  )
}