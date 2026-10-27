import { useMemo, useState } from "react";
import TarjetaResumen from "./TarjetaResumen";
import CalendarioAsistencia from "./CalendarioAsistencia";
import PanelJustificaciones from "./PanelJustificaciones";
import HistorialSesiones from "./HistorialSesiones";
import { nombreMes } from "../../../services/data";
import {
  construirCalendario,
  faltasPorJustificar,
  filasDelMes,
  resumenAsistencia,
} from "../../../services/rendimientoCalculos";

function TabAsistencia({ historial, justificaciones, nivel, hoyISO, onJustificar }) {
  // El calendario, las tarjetas y la tabla siguen el mes elegido (por defecto, el mes actual).
  const [{ anio, mesIndex }, setMes] = useState(() => {
    const [a, m] = hoyISO.split("-").map(Number);
    return { anio: a, mesIndex: m - 1 };
  });

  const filas = useMemo(() => filasDelMes(historial, anio, mesIndex), [historial, anio, mesIndex]);
  const resumen = useMemo(() => resumenAsistencia(filas), [filas]);
  const celdas = useMemo(
    () => construirCalendario(anio, mesIndex, { historial, horarios: nivel.horarios, hoyISO }),
    [anio, mesIndex, historial, nivel.horarios, hoyISO]
  );
  const faltas = useMemo(() => faltasPorJustificar(historial), [historial]);

  const cambiarMes = (delta) =>
    setMes(({ anio: a, mesIndex: m }) => {
      const f = new Date(a, m + delta, 1);
      return { anio: f.getFullYear(), mesIndex: f.getMonth() };
    });

  const sinDatos = resumen.total === 0;
  const notaPct = (pct) => (sinDatos ? "Sin sesiones registradas" : `${pct}% del total`);

  return (
    <>
      <section className="resumen-cards rend-resumen-asistencia">
        <TarjetaResumen
          titulo="Sesiones totales"
          icono="bi-calendar-event"
          colorIcono="azul"
          valor={resumen.total}
          nota={`Registradas en ${nombreMes(mesIndex).toLowerCase()}`}
        />
        <TarjetaResumen
          titulo="Presentes"
          icono="bi-check-lg"
          colorIcono="verde"
          valor={resumen.presentes}
          colorValor="verde"
          nota={notaPct(resumen.porcentajePresentes)}
          barra={{ porcentaje: resumen.porcentajePresentes, color: "verde" }}
        />
        <TarjetaResumen
          titulo="Faltas"
          icono="bi-x-lg"
          colorIcono="rojo"
          valor={resumen.faltas}
          colorValor="rojo"
          nota={
            notaPct(resumen.porcentajeFaltas) +
            (resumen.justificadas > 0 ? ` · ${resumen.justificadas} ${resumen.justificadas === 1 ? "justificada" : "justificadas"}` : "")
          }
          barra={{ porcentaje: resumen.porcentajeFaltas, color: "rojo" }}
        />
        <TarjetaResumen titulo="Inpuntuales" icono="bi-clock" colorIcono="amarillo" valor={resumen.inpuntuales} nota="En este período" />
      </section>

      <div className="rend-asist-layout">
        <CalendarioAsistencia
          celdas={celdas}
          anio={anio}
          mesIndex={mesIndex}
          hoyISO={hoyISO}
          onCambiarMes={cambiarMes}
          onJustificar={onJustificar}
        />
        <PanelJustificaciones
          faltas={faltas}
          justificaciones={justificaciones}
          nivel={nivel}
          hoyISO={hoyISO}
          onJustificar={onJustificar}
        />
      </div>

      <HistorialSesiones filas={filas} nivel={nivel} anio={anio} mesIndex={mesIndex} onJustificar={onJustificar} />
    </>
  );
}

export default TabAsistencia;
