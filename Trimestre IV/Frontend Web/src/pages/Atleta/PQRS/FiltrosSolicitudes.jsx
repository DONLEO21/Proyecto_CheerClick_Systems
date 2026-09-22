
import React from "react";
import { PESTANAS } from "./pqrsData";

export default function FiltrosSolicitudes({
  busqueda,
  onBusqueda,
  filtroEstado,
  onFiltroEstado,
  contadores,
}) {
  return (
    <div className="pqa-filtros">
      <div className="pqa-busqueda">
        <i className="bi bi-search" aria-hidden="true" />
        <label htmlFor="pqa-busqueda" className="visually-hidden">Buscar solicitudes</label>
        <input
          id="pqa-busqueda"
          type="search"
          className="form-control pqa-input"
          placeholder="Buscar por radicado, asunto o categoría"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
        />
      </div>

      <nav className="pqa-pestanas" aria-label="Filtrar por estado">
        {PESTANAS.map((p) => {
          const activa = filtroEstado === p.valor;
          return (
            <button
              key={p.valor}
              type="button"
              className={`pqa-pestana ${activa ? "activa" : ""}`}
              aria-pressed={activa}
              onClick={() => onFiltroEstado(p.valor)}
            >
              {p.etiqueta}
              <span className="pqa-contador">{contadores[p.valor]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
