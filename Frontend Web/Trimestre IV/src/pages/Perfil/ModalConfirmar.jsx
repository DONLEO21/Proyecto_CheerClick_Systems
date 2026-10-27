import { X, Lock } from 'lucide-react';
import Modal from './Modal.jsx';
import { ETIQUETA_CAMPO } from './perfilData.js';

export default function ModalConfirmar({ abierto, onCerrar, cambiosUnaVez, errorGuardar, guardando, onConfirmar }) {
  return (
    <Modal
      abierto={abierto} onCerrar={onCerrar}
      className="perfil-modal--chico" labelledBy="perfil-modal-confirmar-titulo"
    >
      <div className="perfil-modal-cabeza perfil-modal-cabeza--simple">
        <h2 className="perfil-modal-titulo" id="perfil-modal-confirmar-titulo">¿Guardar cambios?</h2>
        <button className="perfil-modal-cerrar" type="button" onClick={onCerrar} aria-label="Cerrar">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <p className="perfil-modal-descripcion">
        Se actualizará tu información personal. ¿Confirmas los cambios realizados?
      </p>

      {cambiosUnaVez.length > 0 && (
        <p className="perfil-modal-advertencia" role="alert">
          <Lock size={14} />
          <span>
            Vas a modificar{' '}
            <strong>{cambiosUnaVez.map((c) => ETIQUETA_CAMPO[c].toLowerCase()).join(', ')}</strong>.
            Después de guardar no podrás volver a cambiarlo.
          </span>
        </p>
      )}

      {errorGuardar && <p className="estado-carga estado-carga--error" role="alert">{errorGuardar}</p>}

      <div className="perfil-modal-pie">
        <button className="btn btn-blanco" type="button" onClick={onCerrar}>
          Cancelar
        </button>
        <button
          className="btn btn-primario" type="button" disabled={guardando}
          onClick={async () => { await onConfirmar(); }}
        >
          {guardando ? 'Guardando…' : 'Sí, guardar'}
        </button>
      </div>
    </Modal>
  );
}