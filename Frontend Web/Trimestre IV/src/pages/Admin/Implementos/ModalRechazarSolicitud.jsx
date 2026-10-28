import { forwardRef, useState } from "react";
import { rechazarSolicitud } from "../../../services/SolicitudesService";

const ModalRechazarSolicitud = forwardRef(function ModalRechazarSolicitud(
  { solicitud, onRechazado },
  ref
) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const cerrar = () => {
    setMotivo("");
    setError("");
    ref.current.close();
  };

  const confirmar = async () => {
    if (!motivo.trim()) {
      setError("Escribe el motivo del rechazo.");
      return;
    }
    setEnviando(true);
    try {
      await rechazarSolicitud(solicitud, motivo);
      onRechazado();
      cerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog-bootstrap">
      <div className="modal-content" style={{ width: "min(490px, 90vw)" }}>
        <div className="modal-header bg-danger text-white">
          <div>
            <h5 className="modal-title mb-0">Rechazar Solicitud</h5>
            <small>Pedido de Implemento</small>
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={cerrar}></button>
        </div>

        <div className="modal-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <label className="form-label">Motivo del Rechazo *</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Escriba aquí los inconvenientes con el proveedor o detalles del rechazo..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        <div className="modal-footer p-3 gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={cerrar}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={confirmar} disabled={enviando}>
            {enviando ? "Enviando..." : "Confirmar Rechazo"}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ModalRechazarSolicitud;