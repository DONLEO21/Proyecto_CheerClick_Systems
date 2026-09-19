// src/components/Horarios/ModalEntrenamientoAtleta.jsx
import React, { useEffect } from "react";
import { CATEGORIAS, formatearFechaCorta } from "./horariosAtletaData";

export default function ModalEntrenamientoAtleta({ sesion, onCerrar }) {
  useEffect(() => {
    const alEscape = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alEscape);
    return () => document.removeEventListener("keydown", alEscape);
  }, [onCerrar]);

  if (!sesion) return null;
  const cat = CATEGORIAS[sesion.cat];

  return (
    <div
      className="superposicion-modal-atleta activo"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="contenedor-modal-atleta">
        <header className={`cabecera-modal ${cat.clase}`}>
          <div className="fila-titulo-modal-atleta">
            <div className="icono-categoria-modal"><i className={`bi ${cat.icono}`} /></div>
            <span className="titulo-modal-atleta">{cat.nombre}</span>
          </div>
          <button className="cerrar-modal" onClick={onCerrar} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="cuerpo-modal-atleta">
          <h3 className="fecha-modal">{formatearFechaCorta(sesion.fecha)}</h3>

          <div className="info-modal">
            <div className="fila-info-modal">
              <span className="icono-info-modal"><i className="bi bi-clock" /></span>
              <span className="texto-info-modal">{sesion.horaInicio} – {sesion.horaFin}</span>
            </div>
            <div className="fila-info-modal">
              <span className="icono-info-modal"><i className="bi bi-person" /></span>
              <span className="texto-info-modal">{sesion.entrenador}</span>
            </div>
          </div>

          <hr className="divisor-modal" />

          <div className="seccion-modal">
            <div className="titulo-seccion-modal">
              <i className="bi bi-bullseye" />
              <span>Enfoque</span>
            </div>
            <div className="item-seccion-modal">
              <i className="bi bi-people" />
              <span>{sesion.enfoque}</span>
            </div>
          </div>

          <hr className="divisor-modal" />

          <div className="seccion-modal">
            <div className="titulo-seccion-modal"><span>Indicaciones</span></div>
            {(sesion.indicaciones || []).map((ind, i) => (
              <div className="item-seccion-modal" key={i}>
                <i className="bi bi-check2-circle" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
