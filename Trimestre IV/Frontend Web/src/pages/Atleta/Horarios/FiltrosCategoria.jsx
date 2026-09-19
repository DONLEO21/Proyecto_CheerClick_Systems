// src/components/Horarios/FiltrosCategoria.jsx
import React from "react";
import { CATEGORIAS, FILTROS_LISTA } from "./horariosAtletaData";

export default function FiltrosCategoria({ filtroActivo, onCambiarFiltro }) {
  return (
    <div className="filtros-categoria" role="group" aria-label="Filtrar por tipo de entrenamiento">
      {FILTROS_LISTA.map((clave) => {
        const activo = filtroActivo === clave;
        const cat = clave === "todos" ? { nombre: "Todos", icono: "bi-calendar3" } : CATEGORIAS[clave];
        return (
          <button
            key={clave}
            type="button"
            className={`chip-filtro ${activo ? "activo" : ""} ${clave !== "todos" ? cat.clase : ""}`}
            aria-pressed={activo}
            onClick={() => onCambiarFiltro(filtroActivo === clave ? "todos" : clave)}
          >
            <i className={`bi ${cat.icono}`} />
            <span>{cat.nombre}</span>
          </button>
        );
      })}
    </div>
  );
}
