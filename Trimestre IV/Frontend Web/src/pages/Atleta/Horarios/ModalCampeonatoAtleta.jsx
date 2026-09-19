// src/components/Horarios/ModalCampeonatoAtleta.jsx
import React, { useEffect } from "react";
import { formatearMoneda } from "./horariosAtletaData";

export default function ModalCampeonatoAtleta({ torneo, nivelEtiqueta, onCerrar, onPagar }) {
  useEffect(() => {
    const alEscape = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alEscape);
    return () => document.removeEventListener("keydown", alEscape);
  }, [onCerrar]);

  if (!torneo) return null;

  return (
    <div
      className="superposicion-modal-atleta activo"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="contenedor-modal-atleta contenedor-modal-atleta--campeonato">
        <header className="cabecera-modal cat-campeonato">
          <div className="fila-titulo-modal-atleta">
            <div className="icono-categoria-modal"><i className="bi bi-trophy" /></div>
            <span className="titulo-modal-atleta">{torneo.nombre}</span>
          </div>
          <button className="cerrar-modal" onClick={onCerrar} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </header>

        {nivelEtiqueta && (
          <div className="envoltura-pill-nivel">
            <span className="pill-nivel-campeonato">{nivelEtiqueta}</span>
          </div>
        )}

        <div className="cuerpo-modal-atleta cuerpo-modal-campeonato-det">
          <dl className="tabla-info-campeonato">
            <div className="fila-info-campeonato">
              <dt><i className="bi bi-calendar3" /> Fecha</dt>
              <dd>{new Date(torneo.fecha + "T00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
            <div className="fila-info-campeonato">
              <dt><i className="bi bi-geo-alt" /> Ciudad</dt>
              <dd>{torneo.ciudad}</dd>
            </div>
            <div className="fila-info-campeonato">
              <dt><i className="bi bi-cash-coin" /> Inscripción</dt>
              <dd><strong>{formatearMoneda(torneo.costo)}</strong></dd>
            </div>
            <div className="fila-info-campeonato fila-info-campeonato--ultimo">
              <dt><i className="bi bi-clock-history" /> {torneo.etiquetaLimite}</dt>
              <dd>{new Date(torneo.limite + "T00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>

          <div className="bloque-publicidad-modal">
            <div className="encabezado-publicidad">
              <i className="bi bi-link-45deg" />
              <span>Información oficial del torneo</span>
            </div>
            {torneo.link ? (
              <a className="btn-link-publicidad" href={torneo.link} target="_blank" rel="noopener noreferrer">
                <i className="bi bi-globe" /> Ver publicidad y detalles oficiales
              </a>
            ) : (
              <div className="btn-link-publicidad btn-link-publicidad--vacio" aria-disabled="true">
                <i className="bi bi-link-45deg" /> Link de publicidad próximamente
              </div>
            )}
          </div>
        </div>

        <div className="acciones-modal-campeonato">
          <button className="btn-pagar-desde-modal" type="button" onClick={() => onPagar(torneo)}>
            <i className="bi bi-credit-card" /> Pagar inscripción
          </button>
        </div>
      </div>
    </div>
  );
}
