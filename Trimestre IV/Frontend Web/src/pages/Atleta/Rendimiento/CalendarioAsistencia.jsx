import { nombreMes, formatearFechaLarga } from "../../../services/data";
import { tituloDeDia } from "../../../services/rendimientoCalculos";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const LEYENDA = [
  ["presente", "Asistí"],
  ["falta", "Falté"],
  ["inpuntual", "Inpuntual"],
  ["justificado", "Justificado"],
  ["programada", "Sesión sin registro"],
  ["sin-sesion", "Sin sesión"],
];

function CalendarioAsistencia({ celdas, anio, mesIndex, hoyISO, onCambiarMes, onJustificar }) {
  return (
    <section className="rend-calendario" aria-label="Calendario de asistencia">
      <div className="rend-calendario__nav">
        <button type="button" className="rend-btn-nav" aria-label="Mes anterior" onClick={() => onCambiarMes(-1)}>
          <i className="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
        <span className="rend-calendario__mes" aria-live="polite">
          {nombreMes(mesIndex)} {anio}
        </span>
        <button type="button" className="rend-btn-nav" aria-label="Mes siguiente" onClick={() => onCambiarMes(1)}>
          <i className="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </div>

      <div className="rend-cal-grid">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="rend-cal-grid__nombre">{d}</div>
        ))}

        {celdas.map((c) => {
          if (c.tipo === "vacio") {
            return <div key={c.clave} className="rend-cal-dia rend-cal-dia--vacio" aria-hidden="true" />;
          }
          const clase = `rend-cal-dia rend-cal-dia--${c.estado}${c.esHoy ? " rend-cal-dia--hoy" : ""}`;
          const titulo = tituloDeDia(c, hoyISO);
          if (c.justificable) {
            return (
              <button
                key={c.clave}
                type="button"
                className={`${clase} rend-cal-dia--boton`}
                title={titulo}
                aria-label={`${formatearFechaLarga(c.fechaISO)}: falta. Justificar`}
                onClick={() => onJustificar(c.fechaISO)}
              >
                {c.dia}
              </button>
            );
          }
          return (
            <div key={c.clave} className={clase} title={titulo || undefined}>
              {c.dia}
            </div>
          );
        })}
      </div>

      <div className="rend-cal-leyenda">
        {LEYENDA.map(([estado, texto]) => (
          <div key={estado} className="rend-cal-leyenda__item">
            <span className={`rend-cal-leyenda__punto rend-cal-leyenda__punto--${estado}`} />
            {texto}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CalendarioAsistencia;
