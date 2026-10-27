
import React from "react";
import {
  MESES_ES,
  celdasDelMes,
  esDiaEntrenamiento,
  esHoy,
  claveFecha,
} from "./calendarioData";

export default function CalendarioMes({
  anio,
  mes,
  diaSeleccionado,
  diasEntrenamiento,
  sesiones,
  onSeleccionarDia,
  onMesAnterior,
  onMesSiguiente,
}) {
  const celdas = celdasDelMes(anio, mes);

  const tieneTiposGuardados = (dia) => {
    const fecha = claveFecha(anio, mes, dia);
    const s = sesiones.find((x) => x.fecha === fecha);
    return !!(s && s.tipos && s.tipos.length);
  };

  return (
    <section className="tarjeta tarjeta-calendario">
      <div className="encabezado-nav-calendario">
        <button className="btn-nav-calendario" onClick={onMesAnterior} aria-label="Mes anterior">
          <i className="bi bi-chevron-left" />
        </button>
        <span className="titulo-mes-calendario">
          {MESES_ES[mes]}, {anio}
        </span>
        <button className="btn-nav-calendario" onClick={onMesSiguiente} aria-label="Mes siguiente">
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="encabezado-cuadricula-cal" aria-hidden="true">
        <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
      </div>

      <div className="dias-cuadricula-cal">
        {celdas.map((dia, i) => {
          if (dia === null) {
            return <div key={`v-${i}`} className="dia-calendario vacio" />;
          }

          const clases = ["dia-calendario"];
          if (esDiaEntrenamiento(anio, mes, dia, diasEntrenamiento)) clases.push("entrenamiento");
          if (tieneTiposGuardados(dia)) clases.push("con-tipo-guardado");
          if (esHoy(anio, mes, dia)) clases.push("hoy");
          if (dia === diaSeleccionado) clases.push("seleccionado");

          return (
            <button
              key={dia}
              type="button"
              className={clases.join(" ")}
              onClick={() => onSeleccionarDia(dia)}
            >
              {dia}
            </button>
          );
        })}
      </div>

      <ul className="leyenda-calendario">
        <li className="elemento-leyenda">
          <span className="punto-leyenda punto-entrenamiento" /> <span>Entrenamiento</span>
        </li>
        <li className="elemento-leyenda">
          <span className="punto-leyenda punto-guardado" /> <span>Tipo guardado</span>
        </li>
        <li className="elemento-leyenda">
          <span className="punto-leyenda punto-hoy" /> <span>Hoy</span>
        </li>
        <li className="elemento-leyenda">
          <span className="punto-leyenda punto-seleccionado" /> <span>Seleccionado</span>
        </li>
      </ul>
    </section>
  );
}
