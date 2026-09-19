// src/components/Horarios/SelectorNivel.jsx
import React from "react";

/**
 * "Viendo: [Nivel Formativo King ▾]"
 * Solo se muestra al administrador, porque él es entrenador de todos los
 * niveles y puede administrarlos todos. Un entrenador normal solo ve el suyo.
 *
 * props:
 *  - niveles: lista completa de niveles
 *  - nivelActivoId: id del nivel que se está viendo
 *  - onCambiar: (id) => void
 */
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
