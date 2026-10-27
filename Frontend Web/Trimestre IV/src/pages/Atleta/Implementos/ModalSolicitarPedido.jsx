import { forwardRef, useEffect, useState } from "react";
import { crearSolicitud } from "../../../services/SolicitudesService";
import { ATLETA_ACTUAL } from "../../../services/AtletaActual";

const ModalSolicitarPedido = forwardRef(function ModalSolicitarPedido(
  { implemento, onEnviado },
  ref
) {
  const [cantidad, setCantidad] = useState(1);
  const [talla, setTalla] = useState("");
  const [metodoPago, setMetodoPago] = useState("presencial");
  const [comprobante, setComprobante] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCantidad(1);
    setTalla("");
    setMetodoPago("presencial");
    setComprobante("");
    setNombreArchivo("");
    setError("");
  }, [implemento]);

  const cerrar = () => ref.current.close();

  if (!implemento) return <dialog ref={ref} className="dialog-atleta" />;

  const total = implemento.precio * cantidad;

  const handleArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setNombreArchivo(archivo.name);
    const lector = new FileReader();
    lector.onload = () => setComprobante(lector.result);
    lector.readAsDataURL(archivo);
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      await crearSolicitud({
        implementoId: implemento.id,
        implementoNombre: implemento.nombre,
        implementoImagen: implemento.imagen,
        atleta: ATLETA_ACTUAL.nombre,
        categoria: ATLETA_ACTUAL.categoria,
        cantidad,
        talla: talla || "N/A",
        precioUnitario: implemento.precio,
        fechaSolicitud: new Date().toISOString().slice(0, 10),
        metodoPago: metodoPago === "presencial" ? "Pago presencial" : "Transferencia Nequi",
        comprobante,
      });
      onEnviado();
      cerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog-atleta">
      <div className="modal-header">
        <div className="modal-header-icono">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h3>Solicitar Pedido</h3>
        <button type="button" className="btn-cerrar-modal" onClick={cerrar}>✕</button>
      </div>

      <div className="modal-body">
        <div className="modal-tarjeta-producto">
          <img
            className="modal-tarjeta-img"
            src={implemento.imagen || "/img/placeholder.png"}
            alt={implemento.nombre}
          />
          <div className="modal-tarjeta-info">
            <span className="modal-tarjeta-badge">Implemento Deportivo</span>
            <p className="modal-tarjeta-nombre">{implemento.nombre}</p>
            <p className="modal-tarjeta-precio">${implemento.precio.toLocaleString("es-CO")}</p>
          </div>
        </div>

        <form className="formulario-pedido" onSubmit={handleEnviar}>
          {error && <div className="alerta-error">{error}</div>}

          <div className="form-section">
            <p className="form-section-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Detalles del pedido
            </p>
            <div className="fila-formulario">
              <div className="campo-formulario c-corto">
                <label htmlFor="cantidad">Cantidad</label>
                <div className="control-cantidad">
                  <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>−</button>
                  <input
                    type="number"
                    id="cantidad"
                    min={1}
                    max={99}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                  />
                  <button type="button" onClick={() => setCantidad((c) => Math.min(99, c + 1))}>+</button>
                </div>
              </div>
              <div className="campo-formulario" style={{ flex: 1 }}>
                <label htmlFor="talla">Talla</label>
                <input
                  type="text"
                  id="talla"
                  placeholder="Ej: 38, M, XL…"
                  value={talla}
                  onChange={(e) => setTalla(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <p className="form-section-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokewidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Método de Pago
            </p>
            <div className="opciones-pago-tarjetas">
              <input
                type="radio"
                name="metodo-pago"
                id="pago-presencial"
                checked={metodoPago === "presencial"}
                onChange={() => setMetodoPago("presencial")}
              />
              <label htmlFor="pago-presencial" className="tarjeta-pago-label">
                <div className="pago-icono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="pago-titulo">Pago presencial</span>
                <span className="pago-subtitulo">Al recoger en el club</span>
              </label>

              <input
                type="radio"
                name="metodo-pago"
                id="pago-nequi"
                checked={metodoPago === "nequi"}
                onChange={() => setMetodoPago("nequi")}
              />
              <label htmlFor="pago-nequi" className="tarjeta-pago-label">
                <div className="pago-icono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <span className="pago-titulo">Transferencia Nequi</span>
                <span className="pago-subtitulo">Sube tu comprobante</span>
              </label>
            </div>
          </div>

          {metodoPago === "nequi" && (
            <div className="form-section">
              <p className="form-section-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Comprobante
              </p>
              <label htmlFor="recibo-nequi" className={`zona-upload ${nombreArchivo ? "zona-upload--activa" : ""}`}>
                <div className="zona-upload-icono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <p className="zona-upload-texto">Haz clic para subir el comprobante</p>
                <span className="zona-upload-hint">PNG, JPG o PDF · Máx. 5 MB</span>
                <span className="zona-upload-nombre">{nombreArchivo || "Ningún archivo seleccionado"}</span>
              </label>
              <input
                type="file"
                id="recibo-nequi"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                onChange={handleArchivo}
              />
            </div>
          )}

          <div className="modal-resumen-precio">
            <div className="resumen-fila">
              <span className="resumen-label">Precio unitario</span>
              <span className="resumen-valor">${implemento.precio.toLocaleString("es-CO")}</span>
            </div>
            <div className="resumen-fila">
              <span className="resumen-label">Cantidad</span>
              <span className="resumen-valor">× {cantidad}</span>
            </div>
            <div className="resumen-divider"></div>
            <div className="resumen-fila resumen-total">
              <span>Total estimado</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
          </div>

          <button type="submit" className="btn-enviar-solicitud" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default ModalSolicitarPedido;