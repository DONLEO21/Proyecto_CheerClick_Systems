import { useState } from "react";
import Modal from "./Modal";

function ModalFormularioPago({ pago, guardando, onCerrar, onGuardar }) {
  const [fecha, setFecha] = useState("");
  const [metodo, setMetodo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  

  const listo = !!fecha && !!metodo;

  const guardar = () => {
    onGuardar({ fechaPago: fecha, metodo, observaciones });
    setFecha("");
    setMetodo("");
    setObservaciones("");
  };

  return (
    <Modal id="menu-regis" abierto={!!pago} onCerrar={onCerrar}>
      {pago && (
        <>
          <aside id="cabe-menu">
            <div id="infor-cabe">
              <svg id="sim-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 16H8" /><path d="M14 8H8" /><path d="M16 12H8" />
                <path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" />
              </svg>
              <span id="titu-menu">Registrar Pago</span>
            </div>
            <div id="x-cabe">
              <svg id="sim-x" onClick={onCerrar} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </div>
          </aside>

          <section id="infor-usu">
            <div id="conte-usu">
              <div id="foto"><div id="detalle-menu"></div></div>
              <div id="usu-tex">
                <h4>{pago.atleta?.nombre ?? "Atleta no encontrado"}</h4>
                <div id="id-usu">
                  <h5>ID atleta:</h5>
                  <button className="fon-blanco">{pago.atleta?.id}</button>
                </div>
              </div>
            </div>
            <div id="mes-conte">
              {pago.etiquetas.map((e) => (
                <button key={e.texto} className="chip-modal">{e.texto}</button>
              ))}
            </div>
          </section>

          <h4 className="dentro-menu">Información del cobro</h4>
          <section id="targetas-cobro">
            <div className="targe-a">
              <div className="targe-co">
                <h5><i class="sim-targe bi bi-person"></i>ID del pago</h5>
                <button className="fon-blan">{pago.id}</button>
              </div>
              <div className="targe-co">
                <h5><i class="sim-targe bi bi-calendar"></i>Fecha generación</h5>
                <span id="gen">{pago.generacion}</span>
              </div>
            </div>
            <div className="targe-a">
              <div className="targe-co">
                <h5><i class="sim-targe bi bi-cash"></i>Valor total</h5>
                <span id="total">
                  {pago.valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="targe-co">
                <h5><i class="sim-targe bi bi-flag-fill"></i>Estado actual</h5>
                <span className="chip-modal">{pago.estadoTexto}</span>
              </div>
            </div>
          </section>

          <div id="linea"></div>
          <h4 className="dentro-menu">Registrar Pago</h4>
          <section id="res-pago">
            <div className="conte-input">
              <label className="label-titu" htmlFor="fecha-pago">Fecha de Pago</label>
              <input id="fecha-pago" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="conte-input">
              <label className="label-titu" htmlFor="metodo-pago">Método de pago</label>
              <select id="metodo-pago" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                <option value="">Metodo Pago</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Billetera Digital">Billetera Digital</option>
              </select>
            </div>
          </section>
          <label className="label" htmlFor="ob">Observaciones</label> <br />
          <textarea id="ob" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />

          <section id="conte-btn">
            <button id="cancelar" onClick={onCerrar}>Cancelar</button>
            <button id="registrar" disabled={!listo || guardando} onClick={guardar}>
              {guardando ? "Guardando…" : "Registrar Pago"}
            </button>
          </section>
        </>
      )}
    </Modal>
  );
}

export default ModalFormularioPago;