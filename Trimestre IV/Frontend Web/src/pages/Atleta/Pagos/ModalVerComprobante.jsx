import Modal from "../../Admin/Pagos/Modal";

function ModalVerComprobante({ mensualidad, atleta, onCerrar }) {
  return (
    <Modal id="menu-regis2-atleta" abierto={!!mensualidad} onCerrar={onCerrar}>
      {mensualidad && (
        <>
          <aside id="cabe-menu-atl">
            <div id="infor-cabe-atl">
              <svg id="sim-menu-atl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              </svg>
              <span id="titu-menu-atl">Comprobante de Pago</span>
            </div>
            <div>
              <svg id="sim-x-atl" onClick={onCerrar} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </div>
          </aside>

          <section id="infor-usu-atl">
            <div id="conte-usu-atl">
              <div id="foto-atl"><div id="detalle-menu-atl"></div></div>
              <div id="usu-tex-atl">
                <h4>{atleta?.nombre}</h4>
                <div id="id-usu-atl">
                  <h5>ID usuario:</h5>
                  <button className="atl-fon-blanco">{atleta?.id}</button>
                </div>
              </div>
            </div>
            <div id="mes-conte-atl"><button>{mensualidad.mes}</button></div>
          </section>

          <section id="conte-compro-atl">
            <div id="docu-infor-atl">
              <div>
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                  </svg>
                </button>
              </div>
              <div>
                <h4>{mensualidad.comprobante}</h4>
                <span>{mensualidad.registrado ? "Validado por el club" : "En revisión"}</span>
              </div>
            </div>
            <div id="infor-pago-atl">
              <h5 className="atl-informacion-pag">{mensualidad.metodo}</h5>
              <h5 className="atl-informacion-pag">Ref: {mensualidad.referencia}</h5>
              <h5 className="atl-informacion-pag">{mensualidad.fechaPago}</h5>
            </div>
          </section>

          <footer id="btn-compro-atl">
            <button className="atl-btn">Descargar</button>
            <button className="atl-btn">Abrir en pestaña</button>
          </footer>
        </>
      )}
    </Modal>
  );
}
export default ModalVerComprobante;