
import React from "react";
import { formatearFechaCorta, formatearMoneda } from "./horariosData";

export default function CompetenciaCard({ torneo, onModificar, onInhabilitar, delay = 0 }) {
  return (
    <div
      className={`tarjeta-competencia ${torneo.inhabilitada ? "inhabilitada" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <figure className="figura-competencia mb-0">
        {torneo.imagen ? (
          <img src={torneo.imagen} alt={torneo.nombre} className="imagen-competencia" />
        ) : (
          <div className="placeholder-trofeo">
            <i className="bi bi-trophy" />
          </div>
        )}
        <span className={`insignia-estado ${torneo.inhabilitada ? "insignia-inactiva" : "insignia-activa"}`}>
          {torneo.inhabilitada ? "Inactiva" : "Activa"}
        </span>
      </figure>
      <div className="cuerpo-competencia">
        <h3 className="nombre-competencia">{torneo.nombre}</h3>
        <ul className="lista-datos">
          <li className="dato-item">
            <i className="bi bi-calendar3" />
            <span>{formatearFechaCorta(torneo.fecha)}</span>
          </li>
          <li className="dato-item">
            <i className="bi bi-geo-alt" />
            <span>{torneo.ciudad}</span>
          </li>
          <li className="dato-item">
            <i className="bi bi-cash-coin" />
            <span>{formatearMoneda(torneo.costo)}</span>
          </li>
          <li className="dato-item">
            <i className="bi bi-clock-history" />
            <span>
              {torneo.etiquetaLimite}: {formatearFechaCorta(torneo.limite)}
            </span>
          </li>
        </ul>
        <div className="acciones-competencia">
          <button className="btn-modificar" onClick={() => onModificar(torneo)}>
            Modificar
          </button>
          
          <button className="btn-inhabilitar" onClick={() => onInhabilitar(torneo)}>
            {torneo.inhabilitada ? "Habilitar" : "Inhabilitar"}
          </button>
        </div>
      </div>
    </div>
  );
}
