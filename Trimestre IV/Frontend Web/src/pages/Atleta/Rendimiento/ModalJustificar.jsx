import { useEffect, useRef, useState } from "react";
import { formatearFechaLarga } from "../../../services/data";
import { horarioDelDia, textoHorario } from "../../../services/rendimientoCalculos";

const MINIMO_CARACTERES = 10;

function ModalJustificar({ fechaISO, nivel, onCerrar, onEnviar }) {
  const dialogRef = useRef(null);
  const archivoRef = useRef(null);
  const [motivo, setMotivo] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialogo = dialogRef.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
  }, []);

  const horas = textoHorario(horarioDelDia(nivel.horarios, fechaISO));
  const faltan = Math.max(0, MINIMO_CARACTERES - motivo.trim().length);
  const puedeEnviar = faltan === 0 && !enviando;

  const enviar = async () => {
    setEnviando(true);
    setError("");
    try {
      await onEnviar({ motivo, archivo });
    } catch (e) {
      setError(e.message || "No se pudo enviar la justificación. Intenta de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="rend-modal"
      aria-labelledby="rend-modal-titulo"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current.close(); // clic en el fondo
      }}
    >
      <div className="rend-modal__header">
        <h2 id="rend-modal-titulo" className="rend-modal__titulo">Justificar inasistencia</h2>
        <button type="button" className="rend-modal__cerrar" aria-label="Cerrar" onClick={() => dialogRef.current.close()}>
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>

      <div className="rend-modal__body">
        <div className="rend-modal__resumen">
          <div className="rend-modal__fecha">{formatearFechaLarga(fechaISO)}</div>
          {horas && (
            <div className="rend-modal__meta">
              <i className="bi bi-clock" aria-hidden="true"></i>
              <span>{horas}</span>
            </div>
          )}
          {nivel.entrenador && (
            <div className="rend-modal__meta">
              <i className="bi bi-person" aria-hidden="true"></i>
              <span>{nivel.entrenador}</span>
            </div>
          )}
        </div>

        <div className="rend-modal__campo">
          <label htmlFor="rend-motivo">
            Motivo de la inasistencia <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="rend-motivo"
            className="rend-modal__textarea"
            placeholder="Consulta médica, viaje..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            autoFocus
          />

          <p
            id="rend-motivo-ayuda"
            className={`rend-modal__ayuda${faltan === 0 ? " rend-modal__ayuda--ok" : ""}`}
            aria-live="polite"
          >
            {faltan === 0
              ? "✓ Ya puedes enviar la justificación. El archivo es opcional."
              : `Escribe al menos ${MINIMO_CARACTERES} caracteres para poder enviar (${faltan === 1 ? "falta 1" : `faltan ${faltan}`}).`}
          </p>
        </div>

        <div className="rend-modal__adjunto">
          <span className="rend-modal__adjunto-label">Adjuntar archivo (Opcional)</span>
          <input
            ref={archivoRef}
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => setArchivo(e.target.files[0] ?? null)}
          />
          <button type="button" className="rend-btn-subir" onClick={() => archivoRef.current.click()}>
            <i className="bi bi-cloud-upload" aria-hidden="true"></i>
            Subir archivo
          </button>
          {archivo && <span className="rend-modal__archivo">{archivo.name}</span>}
        </div>

        {error && <p className="rend-modal__error" role="alert">{error}</p>}
      </div>

      <div className="rend-modal__footer">
        <button type="button" className="rend-btn-cancelar" onClick={() => dialogRef.current.close()}>
          Cancelar
        </button>
        <button type="button" className="rend-btn-enviar" disabled={!puedeEnviar} onClick={enviar}>
          {enviando ? "Enviando…" : "Enviar justificación"}
        </button>
      </div>
    </dialog>
  );
}

export default ModalJustificar;
