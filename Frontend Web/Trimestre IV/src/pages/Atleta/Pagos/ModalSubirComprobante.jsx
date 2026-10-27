import { useState, useEffect } from "react";
import Modal from "../../Admin/Pagos/Modal";

function ModalSubirComprobante({ mensualidad, guardando, onCerrar, onGuardar }) {
  const [metodo, setMetodo] = useState("");
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    if (mensualidad) setMonto(String(mensualidad.valor));
  }, [mensualidad]);

  const listo = metodo && referencia && fecha;

  const enviar = () => {
    onGuardar({
      metodo,
      referencia,
      fechaPago: fecha,
      comprobante: archivo ? archivo.name : `comprobante_${mensualidad.mes.toLowerCase()}.pdf`,
    });
  };

  return (
    <Modal id="menu-regis-atleta" abierto={!!mensualidad} onCerrar={onCerrar}>
      {mensualidad && (
        <>
          <aside id="cabe-menu-atl">
            <div id="infor-cabe-atl">
              <svg id="sim-menu-atl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17V7" />
                <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
              </svg>
              <span id="titu-menu-atl">Subir Comprobante · {mensualidad.mes}</span>
            </div>
            <div>
              <svg id="sim-x-atl" onClick={onCerrar} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </div>
          </aside>

          <section id="con-input-atl">
            <div className="atl-input-div">
              <div className="atl-inputs">
                <label>Método de pago</label>
                <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                  <option value="">Metodo Pago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Billetera Digital">Billetera Digital</option>
                </select>
              </div>
              <div className="atl-inputs">
                <label>Monto Pagado</label>
                <input type="text" value={monto} onChange={(e) => setMonto(e.target.value)} />
              </div>
            </div>
            <div className="atl-input-div">
              <div className="atl-inputs">
                <label>N.° de referencia</label>
                <input type="text" placeholder="Ej: M000000"
                  value={referencia} onChange={(e) => setReferencia(e.target.value)} />
              </div>
              <div className="atl-inputs">
                <label>Fecha del Pago</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
            </div>
          </section>

          <div id="linea-atl"></div>
          <h4 id="titu-com-atl">Comprobante de pago</h4>
          <section id="con-compro-atl">
            <div>
              <label id="detalle-cir-atl" style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3" /><path d="m7 10 5 5 5-5" />
                </svg>
                <input type="file" accept=".pdf,.jpg,.png" hidden
                  onChange={(e) => setArchivo(e.target.files[0])} />
              </label>
            </div>
            <div><span>{archivo ? archivo.name : "Haz clic en el ícono para buscar tu archivo"}</span></div>
            <div><p>PDF, JPG o PNG - máximo 5 MB</p></div>
          </section>

          <footer id="conte-btn-atl">
            <button id="cancelar-atl" onClick={onCerrar}>Cancelar</button>
            <button id="registrar-atl" disabled={!listo || guardando} onClick={enviar}>
              {guardando ? "Enviando…" : "Enviar Comprobante"}
            </button>
          </footer>
        </>
      )}
    </Modal>
  );
}
export default ModalSubirComprobante;