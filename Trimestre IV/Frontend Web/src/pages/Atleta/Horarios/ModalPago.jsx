// src/components/Horarios/ModalPago.jsx
import React, { useState, useRef } from "react";
import { formatearMoneda } from "./horariosAtletaData";

const CAMPOS_VACIOS = { metodo: "", referencia: "", fecha: "" };
const METODOS = [
  { valor: "efectivo", texto: "Efectivo" },
  { valor: "nequi", texto: "Nequi" },
  { valor: "daviplata", texto: "Daviplata" },
];

export default function ModalPago({ torneo, onCerrar, onEnviar }) {
  const [campos, setCampos] = useState(CAMPOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [archivo, setArchivo] = useState(null);
  const [zonaActiva, setZonaActiva] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const inputArchivoRef = useRef(null);

  if (!torneo) return null;

  const esEfectivo = campos.metodo === "efectivo";
  const requiereComprobante = campos.metodo !== "" && !esEfectivo;

  const actualizarCampo = (campo, valor) => {
    setCampos((c) => ({ ...c, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: false }));
  };

  const manejarArchivo = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo supera los 5 MB.");
      return;
    }
    setArchivo({ nombre: file.name, tamañoKB: Math.round(file.size / 1024) });
  };

  const enviarComprobante = () => {
    const nuevosErrores = {};
    if (!campos.metodo) nuevosErrores.metodo = true;
    if (!campos.fecha) nuevosErrores.fecha = true;
    if (requiereComprobante && !campos.referencia) nuevosErrores.referencia = true;
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) return;

    setEnviando(true);
    onEnviar({
      torneoId: torneo.id,
      torneoNombre: torneo.nombre,
      metodo: campos.metodo,
      monto: Number(torneo.costo), // precio oficial, no editable
      referencia: esEfectivo ? null : campos.referencia,
      fecha: campos.fecha,
      archivo: esEfectivo ? null : archivo?.nombre || null,
      estado: "pendiente",
    })
      .then(() => setEnviado(true))
      .catch(() => alert("No se pudo enviar el comprobante. Intenta de nuevo."))
      .finally(() => setEnviando(false));
  };

  return (
    <div
      className="superposicion-modal-atleta activo"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && !enviado && onCerrar()}
    >
      <div className="contenedor-modal-atleta contenedor-modal-atleta--pago">
        <header className="cabecera-modal cabecera-modal--pago">
          <div className="fila-titulo-modal-atleta">
            <div className="icono-categoria-modal"><i className="bi bi-credit-card" /></div>
            <span className="titulo-modal-atleta">
              {torneo.nombre ? `Subir Comprobante — ${torneo.nombre}` : "Subir Comprobante de Pago"}
            </span>
          </div>
          <button className="cerrar-modal" onClick={onCerrar} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </header>

        {enviado ? (
          <div className="estado-exito-pago">
            <i className="bi bi-check-circle-fill icono-exito-pago" />
            <h3>¡Comprobante enviado!</h3>
            <p>Tu comprobante ha sido enviado exitosamente.<br />Te notificaremos cuando sea verificado.</p>
          </div>
        ) : (
          <>
            <div className="cuerpo-modal-atleta cuerpo-modal-atleta--pago">
              {/* Fila 1: Método de pago + Monto (bloqueado al precio oficial) */}
              <div className="cuadricula-campos-pago">
                <div className="campo-formulario-atleta">
                  <label className="etiqueta-campo-atleta" htmlFor="metodo-pago">Método de pago</label>
                  <select
                    id="metodo-pago"
                    className={`entrada-campo ${errores.metodo ? "entrada-campo--error" : ""}`}
                    value={campos.metodo}
                    onChange={(e) => actualizarCampo("metodo", e.target.value)}
                  >
                    <option value="" disabled>Metodo Pago</option>
                    {METODOS.map((m) => (
                      <option key={m.valor} value={m.valor}>{m.texto}</option>
                    ))}
                  </select>
                </div>
                <div className="campo-formulario-atleta">
                  <label className="etiqueta-campo-atleta" htmlFor="monto-pago">Monto Pagado</label>
                  <input
                    id="monto-pago"
                    type="text"
                    className="entrada-campo entrada-campo--bloqueada"
                    value={formatearMoneda(torneo.costo).replace("$", "") + ",00"}
                    disabled
                    readOnly
                  />
                  <span className="pista-campo-bloqueado">
                    <i className="bi bi-lock-fill" /> Precio oficial de inscripción
                  </span>
                </div>
              </div>

              {/* Fila 2: referencia (solo si no es efectivo) + fecha */}
              <div className={`cuadricula-campos-pago ${requiereComprobante ? "" : "cuadricula-campos-pago--una-col"}`}>
                {requiereComprobante && (
                  <div className="campo-formulario-atleta">
                    <label className="etiqueta-campo-atleta" htmlFor="referencia-pago">N.° de referencia</label>
                    <input
                      id="referencia-pago"
                      type="text"
                      placeholder="Ej: M000000"
                      className={`entrada-campo ${errores.referencia ? "entrada-campo--error" : ""}`}
                      value={campos.referencia}
                      onChange={(e) => actualizarCampo("referencia", e.target.value)}
                    />
                  </div>
                )}
                <div className="campo-formulario-atleta">
                  <label className="etiqueta-campo-atleta" htmlFor="fecha-pago">Fecha del Pago</label>
                  <input
                    id="fecha-pago"
                    type="date"
                    className={`entrada-campo ${errores.fecha ? "entrada-campo--error" : ""}`}
                    value={campos.fecha}
                    onChange={(e) => actualizarCampo("fecha", e.target.value)}
                  />
                </div>
              </div>

              <hr className="divisor-modal" />

              {esEfectivo ? (
                <p className="nota-pago-efectivo">
                  Para pagos en efectivo no es necesario indicar número de referencia ni subir comprobante.
                </p>
              ) : (
                <>
                  <p className="titulo-zona-carga">Comprobante de pago</p>
                  <label
                    htmlFor="archivo-comprobante"
                    className={`zona-carga-archivo ${zonaActiva ? "zona-carga-activa" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setZonaActiva(true); }}
                    onDragLeave={() => setZonaActiva(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setZonaActiva(false);
                      manejarArchivo(e.dataTransfer.files[0]);
                    }}
                  >
                    <span className="icono-zona-carga"><i className="bi bi-cloud-arrow-up" /></span>
                    <span className="texto-zona-carga">
                      Arrastra tu archivo aquí o <span className="enlace-zona-carga">haz clic para buscarlo</span>
                    </span>
                    <span className="formatos-zona-carga">PDF, JPG o PNG — máximo 5 MB</span>
                    <input
                      ref={inputArchivoRef}
                      id="archivo-comprobante"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="visualmente-oculto"
                      onChange={(e) => manejarArchivo(e.target.files[0])}
                    />
                  </label>
                  {archivo && <p className="nombre-archivo-cargado">📎 {archivo.nombre}</p>}
                </>
              )}
            </div>

            <footer className="pie-modal-pago">
              <button className="btn-cancelar-pago" type="button" onClick={onCerrar}>Cancelar</button>
              <button className="btn-enviar-comprobante" type="button" onClick={enviarComprobante} disabled={enviando}>
                {enviando ? "Enviando…" : "Enviar Comprobante"}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
