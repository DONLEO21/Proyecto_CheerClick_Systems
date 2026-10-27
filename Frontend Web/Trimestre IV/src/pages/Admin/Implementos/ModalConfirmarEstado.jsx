import { forwardRef, useState } from "react";
import { cambiarEstadoImplemento } from "../../../services/ImplementosService";

const ModalConfirmarEstado = forwardRef(function ModalConfirmarEstado(
  { implemento, accion, onConfirmado, onError },
  ref
) {
  const [procesando, setProcesando] = useState(false);
  const esInhabilitar = accion === "inhabilitar";

  const cerrar = () => ref.current.close();

  const confirmar = async () => {
    if (!implemento) return;
    setProcesando(true);
    try {
      await cambiarEstadoImplemento(implemento, esInhabilitar ? "No Disponible" : "Disponible");
      onConfirmado();
      cerrar();
    } catch (err) {
      cerrar();
      onError?.(err.message);
    } finally {
      setProcesando(false);
    }
  };

  // SVG para el estado "Inhabilitar"
const svgInhabilitar = (
  <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bolt-slash">
    <path d="M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317"/>
    <path d="M15.656 10H20a1 1 0 0 1 .78 1.631l-1.72 1.773"/>
    <path d="M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.82A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643"/>
    <path d="m2 2 20 20"/>
  </svg>
);

// SVG para el estado "Habilitar"
const svgHabilitar = (
  <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bolt">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.82A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.82A1 1 0 0 0 11 14Z"/>
  </svg>
);


  return (
    <dialog ref={ref} className="dialog-bootstrap">
      <div className="modal-content text-center p-4" style={{ width: "min(380px, 90vw)" }}>
        <div className="d-flex justify-content-center mb-3">
          <div className={`p-3 rounded-circle d-flex align-items-center justify-content-center ${esInhabilitar ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`} style={{ width: "60px", height: "60px" }}>
            {esInhabilitar ? svgInhabilitar : svgHabilitar}
          </div>
        </div>
        <h5>{esInhabilitar ? "¿Inhabilitar Elemento Deportivo?" : "¿Habilitar Elemento Deportivo?"}</h5>
        <p className="text-secondary mb-1">
          ¿Está seguro/a de que desea {esInhabilitar ? "inhabilitar" : "habilitar"} el Implemento Deportivo{" "}
          <strong>"{implemento?.nombre}"</strong>?
        </p>
        <div className="bg-light border rounded-3 p-2 text-center my-1">
          <p className="text-body-secondary small fst-italic mb-0">
            Esta acción cambiará su estado a {esInhabilitar ? "No Disponible" : "Disponible"}.
          </p>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button type="button" className="btn btn-outline-secondary" onClick={cerrar}>Cancelar</button>
          <button
            type="button"
            className={`btn ${esInhabilitar ? "btn-danger" : "btn-success"}`}
            onClick={confirmar}
            disabled={procesando}
          >
            {esInhabilitar ? "Inhabilitar" : "Habilitar"}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ModalConfirmarEstado;