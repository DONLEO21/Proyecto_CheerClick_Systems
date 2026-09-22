
import React from "react";
import { ESTADOS, etiquetaTipo, formatearFecha, radicadoDe } from "./pqrsData";

export default function SolicitudCard({ solicitud, delay = 0, onEditar, onVerDetalle }) {
  const estado = ESTADOS[solicitud.estado];
  const editable = solicitud.estado !== "resuelto";

  return (
    <article
      className={`pqa-card pqa-card--${solicitud.estado}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="pqa-card__cuerpo">
        <div className="pqa-card__superior">
          <span className={`pqa-avatar pqa-fondo--${solicitud.estado}`} aria-hidden="true">
            <i className={`bi ${estado.icono}`} />
          </span>
          <span className={`pqa-insignia pqa-insignia--${solicitud.estado}`} role="status">
            <i className={`bi ${estado.iconoInsignia}`} aria-hidden="true" />
            {estado.etiqueta}
          </span>
        </div>

        <span className="pqa-tipo">{etiquetaTipo(solicitud.tipo)}</span>
        <h2 className="pqa-titulo">{solicitud.asunto}</h2>

        <div className="pqa-meta">
          <span>
            Radicado <strong>{radicadoDe(solicitud)}</strong>
          </span>
          <time dateTime={solicitud.fecha}>{formatearFecha(solicitud.fecha)}</time>
        </div>

        <p className="pqa-descripcion">{solicitud.descripcion}</p>

        {solicitud.respuesta ? (
          <div className="pqa-respuesta">
            <div className="pqa-respuesta__cabecera">
              <span className="pqa-respuesta__etiqueta">Respuesta de administración</span>
              {solicitud.fechaRespuesta && (
                <time dateTime={solicitud.fechaRespuesta} className="pqa-respuesta__fecha">
                  {formatearFecha(solicitud.fechaRespuesta)}
                </time>
              )}
            </div>
            <p className="pqa-respuesta__texto">{solicitud.respuesta}</p>
          </div>
        ) : (
          <div className="pqa-asignacion">
            <i className="bi bi-clock" aria-hidden="true" />
            <em>{estado.asignacion}</em>
          </div>
        )}
      </div>

      <div className="pqa-card__pie">
        {editable && (
          <button type="button" className="btn pqa-btn-editar" onClick={() => onEditar(solicitud)}>
            <i className="bi bi-pencil-square" aria-hidden="true" />
            Editar
          </button>
        )}
        <button type="button" className="pqa-ver" onClick={() => onVerDetalle(solicitud)}>
          Ver detalles
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
