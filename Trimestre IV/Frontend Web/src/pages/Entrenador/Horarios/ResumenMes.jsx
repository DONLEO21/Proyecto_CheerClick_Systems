// src/components/Horarios/ResumenMes.jsx
import React from "react";
import { MESES_ES } from "./calendarioData";

/**
 * props:
 *  - anio, mes
 *  - totales: { sesiones, asistidas, faltadas, tardes, porcentaje }
 */
export default function ResumenMes({ anio, mes, totales }) {
  const { sesiones, asistidas, faltadas, tardes, porcentaje } = totales;

  return (
    <section className="tarjeta tarjeta-resumen-mes">
      <div className="fila-encabezado-resumen">
        <h3 className="titulo-resumen">Resumen del Mes</h3>
        <span className="etiqueta-mes-resumen">
          {MESES_ES[mes]} {anio}
        </span>
      </div>

      <div className="cuadricula-resumen" role="list">
        <div className="elemento-resumen" role="listitem">
          <span className="valor-resumen">{sesiones}</span>
          <span className="etiqueta-resumen">Sesiones</span>
        </div>
        <div className="elemento-resumen" role="listitem">
          <span className="valor-resumen color-verde">{asistidas}</span>
          <span className="etiqueta-resumen">Asistidas</span>
        </div>
        <div className="elemento-resumen" role="listitem">
          <span className="valor-resumen color-rojo">{faltadas}</span>
          <span className="etiqueta-resumen">Faltadas</span>
        </div>
        <div className="elemento-resumen" role="listitem">
          <span className="valor-resumen color-naranja">{tardes}</span>
          <span className="etiqueta-resumen">Llegadas Tardes</span>
        </div>
        <div className="elemento-resumen" role="listitem">
          <span className="valor-resumen color-azul">{porcentaje}%</span>
          <span className="etiqueta-resumen">Asistencia</span>
        </div>
      </div>

      <div className="contenedor-barra-asistencia">
        <div className="barra-asistencia" role="progressbar" aria-valuenow={porcentaje}>
          <div className="relleno-barra-asistencia" style={{ width: `${porcentaje}%` }} />
        </div>
        <span className="porcentaje-barra-asistencia">{porcentaje} %</span>
      </div>
    </section>
  );
}
