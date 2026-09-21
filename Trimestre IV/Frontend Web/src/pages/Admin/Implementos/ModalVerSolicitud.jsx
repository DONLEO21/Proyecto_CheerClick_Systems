import { forwardRef } from "react";

const badgeEstado = (estado) => {
  const mapa = {
    Pendiente: "badge-estado-pendiente",
    Aprobado: "badge-estado-aprobado",
    Rechazado: "badge-estado-rechazado",
    Cancelado: "badge-estado-rechazado"
  };
  return mapa[estado] || "badge-estado-pendiente";
};

const ModalVerSolicitud = forwardRef(function ModalVerSolicitud({ solicitud }, ref) {
  const cerrar = () => ref.current.close();

  if (!solicitud) return <dialog ref={ref} className="dialog-bootstrap" />;

  const total = solicitud.cantidad * solicitud.precioUnitario;

  return (
    <dialog ref={ref} className="dialog-bootstrap">
      <div className="modal-content modal-detalle-pedido" style={{ width: "min(480px, 92vw)" }}>
        <div className="modal-header-detalle">
          <div className="detalle-icono">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt-text-icon lucide-receipt-text">
                <path d="M13 16H8"/>
                <path d="M14 8H8"/>
                <path d="M16 12H8"/>
                <path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/>
            </svg>
          </div>
          <div className="flex-grow-1">
            <h5 className="detalle-titulo mb-0">Detalle del Pedido</h5>
            <span className="detalle-codigo">{solicitud.id}</span>
          </div>
          <button type="button" className="btn-cerrar-circular" onClick={cerrar}>×</button>
        </div>

        <div className="modal-body">
          <p className="seccion-detalle">Implemento Deportivo</p>
          <div className="caja-gris caja-implemento">
            <img
              src={solicitud.implementoImagen || "/img/placeholder.png"}
              alt={solicitud.implementoNombre}
              className="img-modal"
              style={{ width: "56px", height: "56px" }}
            />
            <div>
              <strong className="d-block">{solicitud.implementoNombre}</strong>
              <span className="text-muted small">({solicitud.cantidad})</span>
              <span className="text-danger fw-bold d-block">
                ${solicitud.precioUnitario.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          <p className="seccion-detalle">Solicitante</p>
          <div className="row g-2">
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Atleta</small>
                <div>{solicitud.atleta}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Categoría</small>
                <div>{solicitud.categoria}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Fecha solicitud</small>
                <div>{solicitud.fechaSolicitud}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Estado</small>
                <div>
                  <span className={`badge-estado ${badgeEstado(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="seccion-detalle">Detalles del Pedido</p>
          <div className="row g-2">
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Cantidad</small>
                <div> {solicitud.cantidad}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Talla</small>
                <div>{solicitud.talla}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Precio unitario</small>
                <div>${solicitud.precioUnitario.toLocaleString("es-CO")}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="caja-gris">
                <small className="dato-label">Total</small>
                <div className="text-danger fw-bold">${total.toLocaleString("es-CO")}</div>
              </div>
            </div>
          </div>

          <p className="seccion-detalle">Método de Pago</p>
          <div className="caja-metodo-pago">
            <span className="metodo-pago-icono-inline">
              {solicitud.metodoPago?.startsWith("Pago presencial") ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5 12 3l9 6.5" />
                  <path d="M5 10v10h14V10" />
                  <path d="M9 20v-6h6v6" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="2" width="12" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              )}
            </span>
            <strong>{solicitud.metodoPago}</strong>
            <span className="check-metodo-pago">✓</span>
          </div>

          <p className="seccion-detalle">Comprobante Adjunto</p>
          <div className="caja-comprobante">
            <span className="me-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip-icon lucide-paperclip">
                <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>
              </svg>
            </span>
            {solicitud.comprobante ? (
              <a href={solicitud.comprobante} target="_blank" rel="noreferrer">Ver comprobante</a>
            ) : (
              <span className="text-muted">No se adjuntó comprobante</span>
            )}
          </div>

          {solicitud.estado === "Rechazado" && solicitud.motivoRechazo && (
            <div className="alert alert-danger py-2 mt-3 mb-0">
              <strong>Motivo del rechazo:</strong> {solicitud.motivoRechazo}
            </div>
          )}
        </div>

        <div className="modal-footer-total">
          <div>
            <small className="dato-label d-block">Total del Pedido</small>
            <span className="text-danger fw-bold fs-5">${total.toLocaleString("es-CO")}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default ModalVerSolicitud;