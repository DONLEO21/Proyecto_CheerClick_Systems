import { forwardRef, useState } from "react";
import { cancelarSolicitud } from "../../../services/SolicitudesService";

const ModalCancelarSolicitud = forwardRef(function ModalCancelarSolicitud(
  { solicitud, onCancelado, onError },
  ref
) {
  const [procesando, setProcesando] = useState(false);

  const cerrar = () => ref.current.close();

  const confirmar = async () => {
    if (!solicitud) return;
    setProcesando(true);
    try {
      await cancelarSolicitud(solicitud);
      onCancelado();
      cerrar();
    } catch (err) {
      cerrar();
      onError?.(err.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog-atleta dialog-cancelar">
      <div className="modal-confirmacion-alerta">
        <div className="contenedor-logo-alerta">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>
        </div>
        <h2>¿Desea cancelar este pedido?</h2>
        <p>Esta acción no se puede deshacer y el club liberará el producto para otros deportistas.</p>
        <div className="modal-confirmar-botones">
          <button type="button" className="btn-mantener-pedido" onClick={cerrar}>No, mantener</button>
          <button type="button" className="btn-confirmar-cancelar" onClick={confirmar} disabled={procesando}>
            {procesando ? "Cancelando..." : "Sí, cancelar"}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ModalCancelarSolicitud;