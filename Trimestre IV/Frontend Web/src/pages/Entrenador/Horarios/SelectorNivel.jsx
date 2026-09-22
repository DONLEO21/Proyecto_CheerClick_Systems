
import React from "react";

export default function SelectorNivel({ niveles, nivelActivoId, onCambiar }) {
  return (
    <div className="selector-nivel">
      <span className="etiqueta-selector-nivel">Viendo:</span>
      <select
        className="campo-selector-nivel"
        value={nivelActivoId ?? ""}
        onChange={(e) => onCambiar(Number(e.target.value))}
        aria-label="Seleccionar nivel a administrar"
      >
        {niveles.map((n) => (
          <option key={n.id} value={n.id}>
            {n.categoria}
          </option>
        ))}
      </select>
    </div>
  );
}
