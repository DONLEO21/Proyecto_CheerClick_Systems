import Modal from "./Modal";


function ModalComprobante({ comprobante, onCerrar }) {
  return (
    <Modal id="menu-regis2" abierto={!!comprobante} onCerrar={onCerrar}>
      {comprobante && (
        <>
          <aside id="cabe-menu">
            <div id="infor-cabe">
              <svg id="sim-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
              </svg>
              <span id="titu-menu">Comprobante de Pago</span>
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
                <h4>{comprobante.atleta?.nombre ?? "Atleta no encontrado"}</h4>
                <div id="id-usu">
                  <h5>ID atleta:</h5>
                  <button className="fon-blanco">{comprobante.atleta?.id}</button>
                </div>
              </div>
            </div>
            <div id="mes-conte">
              <button className="chip-modal">{comprobante.etiqueta}</button>
            </div>
          </section>

          

          {comprobante.archivo ? (
            <>
              <section id="conte-compro">
                <div id="docu-infor">
                  <div>
                    <button className="fondo-none border-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h4>{comprobante.archivo}</h4>
                    <span>Subido por atleta</span>
                  </div>
                </div>
                <div id="infor-pago">
                  <h5 className="informacion-pag"><i class="sim-pago bi bi-wallet2"></i>{comprobante.metodo}</h5>
                  <h5 className="informacion-pag"><i class="sim-pago bi bi-bank"></i>Ref: {comprobante.referencia}</h5>
                  <h5 className="informacion-pag"><i class="sim-pago bi bi-calendar"></i>{comprobante.fecha}</h5>
                </div>
              </section>
              <footer id="btn-compro">
                <button className="btn-accion-compro">Descargar</button>
                <button className="btn-accion-compro">Abrir en pestaña</button>
              </footer>
            </>
          ) : (
            <section id="conte-compro">
              <div id="docu-infor">
                <div>
                  <h4>Sin comprobante</h4>
                  <span>El atleta todavía no ha subido su comprobante</span>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </Modal>
  );
}

export default ModalComprobante;