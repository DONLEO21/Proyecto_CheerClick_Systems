import { nombreMes } from "../../../services/data";
import {
  ETIQUETA_ASISTENCIA,
  ETIQUETA_JUSTIFICACION,
  fechaCortaTabla,
  horarioDelDia,
  puedeJustificar,
  textoHorario,
} from "../../../services/rendimientoCalculos";

const ICONO_ESTADO = {
  presente: "bi-check-lg",
  falta: "bi-x-lg",
  inpuntual: "bi-clock",
  justificado: "bi-file-earmark-text",
};

function textoAccion(fila) {
  if (fila.estado === "falta" && fila.justificacion) {
    return `Justificación ${ETIQUETA_JUSTIFICACION[fila.justificacion.estado].toLowerCase()}`;
  }
  return fila.motivo;
}

function HistorialSesiones({ filas, nivel, anio, mesIndex, onJustificar }) {
  const ordenadas = [...filas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <section className="rend-historial" aria-label="Historial de sesiones">
      <h3>
        Historial de sesiones · {nombreMes(mesIndex)} {anio}
      </h3>
      <div className="rend-tabla-wrap">
        <table className="rend-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Entrenador</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.length === 0 && (
              <tr>
                <td colSpan={5} className="rend-tabla__vacia">Sin sesiones registradas en este mes.</td>
              </tr>
            )}
            {ordenadas.map((f) => (
              <tr key={f.fecha}>
                <td>{fechaCortaTabla(f.fecha)}</td>
                <td>{textoHorario(horarioDelDia(nivel.horarios, f.fecha)) || "—"}</td>
                <td>{nivel.entrenador || "—"}</td>
                <td>
                  <span className={`rend-pill rend-pill--${f.estado}`}>
                    <i className={`bi ${ICONO_ESTADO[f.estado] ?? "bi-check-lg"}`} aria-hidden="true"></i>
                    {ETIQUETA_ASISTENCIA[f.estado] ?? f.estado}
                  </span>
                </td>
                <td>
                  {puedeJustificar(f) ? (
                    <button type="button" className="rend-btn-justificar" onClick={() => onJustificar(f.fecha)}>
                      <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
                      Justificar
                    </button>
                  ) : textoAccion(f) ? (
                    <span className="rend-texto-suave">{textoAccion(f)}</span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default HistorialSesiones;
