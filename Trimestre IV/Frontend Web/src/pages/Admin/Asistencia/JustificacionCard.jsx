import { iniciales, nombreCortoNivel } from "../../../services/data";

const ETIQUETA_ESTADO = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export default function JustificacionCard({ justificacion, atleta, nivel, onAprobar, onRechazar }) {
  const nombreAtleta = atleta ? `${atleta.nombre} ${atleta.apellido}` : "Atleta desconocido";
  const nivelLabel = nivel ? nombreCortoNivel(nivel.categoria) : "";
  const [anio, mes, dia] = justificacion.fecha.split("-");
  const fechaCorta = `${dia} ${MES_ABREV[Number(mes) - 1]} ${anio}`;

  return (
    <div className={`just-card just-card-${justificacion.estado}`}>
      <div className="just-card-header">
        <span className="just-avatar">{iniciales(atleta?.nombre, atleta?.apellido)}</span>
        <div className="just-card-nombre-bloque">
          <span className="just-card-nombre">{nombreAtleta}</span>
          <span className="just-card-nivel">{nivelLabel}</span>
        </div>
        <span className={`just-estado-badge just-estado-${justificacion.estado}`}>
          {ETIQUETA_ESTADO[justificacion.estado]}
        </span>
      </div>

      <div className="just-card-meta">
        <span className="just-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          {fechaCorta}
        </span>
        {(justificacion.horaInicio || justificacion.horaFin) && (
          <span className="just-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {justificacion.horaInicio} – {justificacion.horaFin}
          </span>
        )}
      </div>

      <p className="just-card-motivo">&ldquo;{justificacion.motivo}&rdquo;</p>

      {justificacion.archivoNombre ? (
        <div className="just-card-archivo">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span className="just-card-archivo-nombre">{justificacion.archivoNombre}</span>
          <span className="just-card-archivo-tamano">· {justificacion.archivoTamano}</span>
          <span className="just-card-archivo-link">Ver archivo</span>
        </div>
      ) : (
        <div className="just-card-archivo just-card-archivo-vacio">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          Sin archivo adjunto
        </div>
      )}

      {justificacion.estado === "pendiente" ? (
        <div className="just-card-acciones">
          <button type="button" className="btn-just-rechazar" onClick={onRechazar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
            Rechazar
          </button>
          <button type="button" className="btn-just-aprobar" onClick={onAprobar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Aprobar
          </button>
        </div>
      ) : (
        justificacion.observacion && (
          <p className="just-card-observacion">
            <strong>Observación:</strong> {justificacion.observacion}
          </p>
        )
      )}
    </div>
  );
}

const MES_ABREV = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
