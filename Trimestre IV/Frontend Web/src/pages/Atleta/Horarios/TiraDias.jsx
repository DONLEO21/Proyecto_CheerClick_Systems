// src/components/Horarios/TiraDias.jsx
import React from "react";
import { DIAS_ABREV, DIAS_NOMBRE, MESES, fechaAISO, mismaFecha, CATEGORIAS } from "./horariosAtletaData";

export default function TiraDias({ lunes, sesionesPorFecha }) {
  const hoy = new Date();

  return (
    <div className="tira-dias" role="list" aria-label="Días de la semana">
      {DIAS_ABREV.map((abrev, i) => {
        const d = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i);
        const iso = fechaAISO(d);
        const esHoy = mismaFecha(d, hoy);
        const sesionesDelDia = sesionesPorFecha[iso] || [];

        return (
          <div
            key={iso}
            className={`celda-dia ${esHoy ? "hoy" : ""}`}
            role="listitem"
            aria-label={`${DIAS_NOMBRE[i]}, ${d.getDate()} de ${MESES[d.getMonth()]}`}
          >
            <span className="abrev-dia" aria-hidden="true">{abrev}</span>
            <span className="numero-dia">{d.getDate()}</span>
            <div className="puntos-dia" aria-hidden="true">
              {sesionesDelDia.map((s, idx) => (
                <span key={idx} className={`punto punto-${CATEGORIAS[s.cat]?.clase.replace("cat-", "")}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
