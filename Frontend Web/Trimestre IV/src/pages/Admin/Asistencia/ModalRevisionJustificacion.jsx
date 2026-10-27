import { forwardRef, useEffect, useState } from "react";
import { iniciales, nombreCortoNivel } from "../../../services/data";

const ModalRevisionJustificacion = forwardRef(function ModalRevisionJustificacion(
  { accion, justificacion, atleta, nivel, onConfirmar },
  ref
) {
  const [observacion, setObservacion] = useState("");
  const esAprobar = accion === "aprobar";

  useEffect(() => {
    setObservacion("");
  }, [justificacion?.id, accion]);

  const cerrar = () => ref.current?.close();

  const confirmar = () => {
    onConfirmar?.(observacion.trim());
    cerrar();
  };

  if (!justificacion) return <dialog ref={ref} id="modal-revision-justificacion" />;

  const nombreAtleta = atleta ? `${atleta.nombre} ${atleta.apellido}` : "Atleta desconocido";
  const nivelLabel = nivel ? nombreCortoNivel(nivel.categoria) : "";
  const [anio, mes, dia] = justificacion.fecha.split("-");

  return (
    <dialog ref={ref} id="modal-revision-justificacion">
      <div className="modal-revision">
        <div className={`modal-revision-icono ${esAprobar ? "modal-revision-icono-ok" : "modal-revision-icono-no"}`}>
          {esAprobar ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          )}
        </div>

        <h2>{esAprobar ? "Aprobar justificación" : "Rechazar justificación"}</h2>
        <p className="modal-revision-subtitulo">
          Estás por {esAprobar ? "aprobar" : "rechazar"} la justificación de inasistencia de:
        </p>

        <div className="modal-revision-atleta">
          <span className="just-avatar">{iniciales(atleta?.nombre, atleta?.apellido)}</span>
          <div className="just-card-nombre-bloque">
            <span className="just-card-nombre">{nombreAtleta}</span>
            <span className="modal-revision-atleta-meta">{nivelLabel} · {dia}/{mes}/{anio}</span>
          </div>
        </div>

        <label className="modal-revision-label" htmlFor="observacion-revision">
          Observación <span className="modal-revision-opcional">(opcional)</span>
        </label>
        <textarea
          id="observacion-revision"
          className={`modal-revision-textarea ${esAprobar ? "modal-revision-textarea-ok" : "modal-revision-textarea-no"}`}
          rows={3}
          placeholder={
            esAprobar
              ? "Ej: Certificado médico verificado. Justificación válida."
              : "Ej: No se adjuntó ningún soporte válido."
          }
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        />

        <div className="modal-revision-botones">
          <button type="button" className="btn-modal-cancelar" onClick={cerrar}>Cancelar</button>
          <button
            type="button"
            className={esAprobar ? "btn-modal-confirmar-ok" : "btn-modal-confirmar-no"}
            onClick={confirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ModalRevisionJustificacion;
