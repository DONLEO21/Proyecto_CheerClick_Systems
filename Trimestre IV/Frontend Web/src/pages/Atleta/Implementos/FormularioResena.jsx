import { Fragment, useState } from "react";
import { crearResena } from "../../../services/ResenaService";
import { actualizarSolicitud } from "../../../services/SolicitudesService";
import { ATLETA_ACTUAL } from "../../../services/AtletaActual";

export default function FormularioResena({ solicitud, onEnviada }) {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (!calificacion) {
      setError("Selecciona una calificación.");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      await crearResena({
        implementoId: solicitud.implementoId,
        implementoNombre: solicitud.implementoNombre,
        atleta: ATLETA_ACTUAL.nombre,
        calificacion,
        comentario,
        fecha: new Date().toISOString().slice(0, 10),
      });
      await actualizarSolicitud(solicitud.id, { ...solicitud, resenaEnviada: true });
      onEnviada();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="seccion-comentario-recibido">
      <label>Deja una reseña (opcional):</label>

      <div className="estrellas-rating" role="group" aria-label="Calificación del producto">
        {[5, 4, 3, 2, 1].map((valor) => (
          <Fragment key={valor}>
            <input
              type="radio"
              id={`rating-${solicitud.id}-${valor}`}
              name={`rating-${solicitud.id}`}
              checked={calificacion === valor}
              onChange={() => setCalificacion(valor)}
            />
            <label htmlFor={`rating-${solicitud.id}-${valor}`} title={`${valor} estrellas`}>★</label>
          </Fragment>
        ))}
      </div>

      {error && <p className="alerta-error">{error}</p>}

      <textarea
        placeholder="Ej: El producto llegó en perfectas condiciones…"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button type="button" className="btn-enviar-comentario" onClick={enviar} disabled={enviando}>
        {enviando ? "Enviando..." : "Enviar reseña"}
      </button>
    </div>
  );
}