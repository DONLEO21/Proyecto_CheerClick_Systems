import {
  agruparJustificaciones,
  diaYMes,
  ETIQUETA_JUSTIFICACION,
  horarioDelDia,
  textoHorario,
} from "../../../services/rendimientoCalculos";

function FechaCaja({ fechaISO, variante }) {
  const { dia, mes } = diaYMes(fechaISO);
  return (
    <div className={`rend-just__fecha${variante ? ` rend-just__fecha--${variante}` : ""}`}>
      <span className="rend-just__dia">{dia}</span>
      <span className="rend-just__mes">{mes}</span>
    </div>
  );
}

function LineaHora({ texto }) {
  return (
    <span className="rend-just__hora">
      <i className="bi bi-clock" aria-hidden="true"></i>
      {texto}
    </span>
  );
}

const CLASE_ESTADO = { pendiente: "revision", aprobada: "aprobada", rechazada: "rechazada" };
const ICONO_ESTADO = { pendiente: "bi-hourglass-split", aprobada: "bi-check-lg", rechazada: "bi-x-lg" };

function ItemEnviada({ j, entrenador, historica }) {
  const horas = j.horaInicio || j.horaFin ? `${j.horaInicio} – ${j.horaFin}` : "";
  const rechazada = j.estado === "rechazada";
  const claseEstado = CLASE_ESTADO[j.estado] ?? "revision";

  return (
    <li className={`rend-just rend-just--${rechazada ? "rechazada" : "enviada"}${historica ? " rend-just--historica" : ""}`}>
      <div className="rend-just__top">
        <FechaCaja fechaISO={j.fecha} variante={rechazada ? "rojo" : "azul"} />
        <div className="rend-just__info">
          <span className="rend-just__titulo">Justificación</span>
          <LineaHora texto={[horas, entrenador].filter(Boolean).join(" · ")} />
          <span className="rend-just__motivo">{j.motivo}</span>
        </div>
        <span className={`rend-just__estado rend-just__estado--${claseEstado}`}>
          <i className={`bi ${ICONO_ESTADO[j.estado] ?? "bi-hourglass-split"}`} aria-hidden="true"></i>
          {ETIQUETA_JUSTIFICACION[j.estado] ?? j.estado}
        </span>
      </div>

      {j.archivoNombre && (
        <div className="rend-just__archivo">
          <i className="bi bi-paperclip" aria-hidden="true"></i>
          <span>{j.archivoNombre}</span>
          {j.archivoTamano && <span className="rend-just__archivo-size">· {j.archivoTamano}</span>}
        </div>
      )}

      {j.observacion && j.estado !== "pendiente" && (
        <div className={`rend-just__observacion rend-just__observacion--${rechazada ? "rechazo" : "nota"}`}>
          <i className={`bi ${rechazada ? "bi-info-circle" : "bi-chat-left-text"}`} aria-hidden="true"></i>
          <span>{j.observacion}</span>
        </div>
      )}
    </li>
  );
}

function PanelJustificaciones({ faltas, justificaciones, nivel, hoyISO, onJustificar }) {
  const { recientes, anteriores } = agruparJustificaciones(justificaciones, hoyISO);
  const hayContenido = faltas.length + recientes.length + anteriores.length > 0;

  return (
    <section className="rend-panel-just" aria-label="Justificaciones">
      <div className="rend-panel-just__header">
        <h3>
          <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
          Justificaciones
        </h3>
        {faltas.length > 0 ? (
          <span className="rend-panel-just__badge">
            {faltas.length} {faltas.length === 1 ? "pendiente" : "pendientes"}
          </span>
        ) : (
          <span className="rend-panel-just__badge rend-panel-just__badge--ok">Al día</span>
        )}
      </div>

      {!hayContenido && <p className="rend-vacio">No tienes faltas por justificar ni justificaciones enviadas.</p>}

      <ul className="rend-just-lista">
        {faltas.map((f) => {
          const horario = textoHorario(horarioDelDia(nivel.horarios, f.fecha));
          return (
            <li key={f.fecha} className="rend-just rend-just--pendiente">
              <div className="rend-just__top">
                <FechaCaja fechaISO={f.fecha} />
                <div className="rend-just__info">
                  <span className="rend-just__titulo">Falta sin justificar</span>
                  <LineaHora texto={[horario, nivel.entrenador].filter(Boolean).join(" · ")} />
                </div>
                <button type="button" className="rend-btn-justificar rend-just__btn" onClick={() => onJustificar(f.fecha)}>
                  Justificar
                </button>
              </div>
            </li>
          );
        })}

        {recientes.map((j) => (
          <ItemEnviada key={j.id} j={j} entrenador={nivel.entrenador} />
        ))}

        {anteriores.length > 0 && faltas.length + recientes.length > 0 && (
          <li className="rend-just-separador" aria-hidden="true">Anteriores</li>
        )}
        {anteriores.map((j) => (
          <ItemEnviada key={j.id} j={j} entrenador={nivel.entrenador} historica />
        ))}
      </ul>
    </section>
  );
}

export default PanelJustificaciones;
