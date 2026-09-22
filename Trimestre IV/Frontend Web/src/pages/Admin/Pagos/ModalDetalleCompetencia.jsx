import { useState } from "react";
import Modal from "./Modal";

function ModalDetalleCompetencia({ competencia, pagos, onCerrar, onValidar, onVerComprobante }) {
  const [filtro, setFiltro] = useState("todos");

  const visibles = pagos.filter((p) => {
    if (filtro === "pagados") return p.estado === "validado";
    if (filtro === "pendientes") return p.estado !== "validado";
    return true;
  });

  return (
    <Modal id="menu-regis3" abierto={!!competencia} onCerrar={onCerrar}>
      {competencia && (
        <>
          <aside id="cabe-menu">
            <div id="infor-tro">
              <svg id="sim-tro" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
                <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
                <path d="M18 9h1.5a1 1 0 0 0 0-5H18" /><path d="M4 22h16" />
                <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
                <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
              </svg>
              <span id="titu-menu">{competencia.nombre}</span>
              <button id="btn-tro">{competencia.nivel}</button>
            </div>
            <div id="x-cabe">
              <svg id="sim-x" onClick={onCerrar} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </div>
          </aside>

          <section id="targetas-tro">
            <div className="targe-tro">
              <h4 id="titu-tro">Pagaron</h4>
              <span id="avlor-tro">{competencia.pagados}/{competencia.inscritos}</span>
            </div>
            <div className="targe-tro">
              <h4 id="titu-tro">Validados</h4>
              <span id="avlor-tro">{competencia.validados}/{competencia.pagados}</span>
            </div>
            <div className="targe-tro">
              <h4 id="titu-tro">Recaudado</h4>
              <span id="avlor-tro">
                {competencia.recaudado.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
              </span>
            </div>
          </section>

          <section id="botones-tro">
            <button className={filtro === "todos" ? "btn-filt" : "btn-fil"} onClick={() => setFiltro("todos")}>Todos</button>
            <button className={filtro === "pagados" ? "btn-filt" : "btn-fil"} onClick={() => setFiltro("pagados")}>Pagados</button>
            <button className={filtro === "pendientes" ? "btn-filt" : "btn-fil"} onClick={() => setFiltro("pendientes")}>Pendiente</button>
          </section>

          <section id="tro-atle">
            {visibles.map((p) => (
              <div id="atle-targe" key={p.id}>
                <div id="a-t">
                  <div><div id="deta-fto"></div></div>
                  <div>
                    <h5 id="nombre-atl">{p.atleta?.nombre ?? "Atleta no encontrado"}</h5>
                    <span id="ID-fecha">{p.id} · {p.fechaPago}</span>
                  </div>
                </div>
                <div id="acci-a">
                  {p.estado === "validado" ? (
                    <span className="pill-registrado">Validado</span>
                  ) : (
                    <button className="regi" onClick={() => onValidar(p)}>Validar</button>
                  )}
                  <button className="btn-ojo btn-sm btn-light" onClick={() => onVerComprobante(p)}>
                    <i class="svg-de bi bi-eye"></i>
                  </button>
                </div>
              </div>
            ))}
            {visibles.length === 0 && <p className="text-muted">Ningún atleta coincide con este filtro.</p>}
          </section>
        </>
      )}
    </Modal>
  );
}

export default ModalDetalleCompetencia;