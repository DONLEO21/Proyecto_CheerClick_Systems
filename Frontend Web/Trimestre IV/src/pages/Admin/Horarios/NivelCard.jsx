
import React from "react";
import { formatearDias } from "./horariosData";
import { formatearRangoHora } from "../../Entrenador/Horarios/calendarioData";

export default function NivelCard({ nivel, onModificar, onInhabilitar, delay = 0 }) {
  return (
    <div
      className={`tarjeta-categoria ${nivel.inhabilitado ? "inhabilitada" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="encabezado-categoria">{nivel.categoria}</div>
      <div className="cuerpo-categoria">
        <div className="info-entrenador">
          <img src={nivel.foto} alt={nivel.entrenador} className="foto-entrenador" />
          <div className="datos-entrenador">
            <h3>{nivel.entrenador}</h3>
            <div className="horarios">
              {nivel.horarios.map((bloque, idx) => (
                <span key={idx} className="insignia-horario">
                  <i className="bi bi-calendar3" />
                  {formatearDias(bloque.dias)} · {formatearRangoHora(bloque.inicio, bloque.fin)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="acciones-categoria">
          <button className="btn-modificar" onClick={() => onModificar(nivel)}>
            Modificar
          </button>
          <button className="btn-inhabilitar" onClick={() => onInhabilitar(nivel)}>
            {nivel.inhabilitado ? "Habilitar" : "Inhabilitar"}
          </button>
        </div>
      </div>
    </div>
  );
}
