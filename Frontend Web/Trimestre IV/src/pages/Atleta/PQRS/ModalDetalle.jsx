// src/pages/Atleta/PQRS/ModalDetalle.jsx
import React from "react";
import ModalBase from "./ModalBase";
import { ESTADOS, etiquetaTipo, formatearFecha, radicadoDe } from "./pqrsData";

export default function ModalDetalle({
  abierto,
  solicitud,
  seguimiento,
  setSeguimiento,
  enviando,
  onCerrar,
  onEnviarSeguimiento,
}) {
  if (!abierto || !solicitud) return null;

  const estado = ESTADOS[solicitud.estado];
  const resuelta = solicitud.estado === "resuelto";
  const seguimientos = solicitud.seguimientos ?? [];

  return (
    <ModalBase
      titulo={solicitud.asunto}
      subtitulo={`Radicado ${radicadoDe(solicitud)} · ${formatearFecha(solicitud.fecha)}`}
      icono={estado.icono}
      estado={solicitud.estado}
      enviando={enviando}
      onCerrar={onCerrar}
      onSubmit={resuelta ? undefined : onEnviarSeguimiento}
      pie={
        resuelta ? (
          <button type="button" className="btn pqa-btn-primario pqa-btn-cerrar-detalle" onClick={onCerrar}>
            Cerrar
          </button>
        ) : (
          <>
            <button type="button" className="btn pqa-btn-cancelar" disabled={enviando} onClick={onCerrar}>
              Cerrar
            </button>
            <button type="submit" className="btn pqa-btn-primario" disabled={enviando}>
              {enviando ? (
                <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              ) : (
                <i className="bi bi-send" aria-hidden="true" />
              )}
              Enviar seguimiento
            </button>
          </>
        )
      }
    >
      <div className="pqa-resumen">
        <div className="pqa-resumen__item">
          <span className="pqa-resumen__etiqueta">Tipo</span>
          <span className="pqa-resumen__valor">{etiquetaTipo(solicitud.tipo)}</span>
        </div>
        <div className="pqa-resumen__item">
          <span className="pqa-resumen__etiqueta">Estado</span>
          <span className={`pqa-insignia pqa-insignia--${solicitud.estado} pqa-insignia--detalle`}>
            <i className={`bi ${estado.iconoInsignia}`} aria-hidden="true" />
            {estado.etiqueta}
          </span>
        </div>
        <div className="pqa-resumen__item">
          <span className="pqa-resumen__etiqueta">Registrado</span>
          <time dateTime={solicitud.fecha} className="pqa-resumen__valor">
            {formatearFecha(solicitud.fecha)}
          </time>
        </div>
      </div>

      <div className="pqa-caja-gris">
        <p className="pqa-seccion-titulo">Descripción de la solicitud</p>
        <p className="pqa-seccion-texto">{solicitud.descripcion}</p>
      </div>

      {solicitud.evidencia && (
        <p className="pqa-evidencia">
          <i className="bi bi-paperclip" aria-hidden="true" />
          Evidencia adjunta: <strong>{solicitud.evidencia}</strong>
        </p>
      )}

      {seguimientos.length > 0 && (
        <div className="pqa-caja-gris">
          <p className="pqa-seccion-titulo">Información adicional enviada</p>
          <ul className="pqa-seguimientos">
            {seguimientos.map((s, i) => (
              <li key={i}>
                <time dateTime={s.fecha}>{formatearFecha(s.fecha)}</time>
                <span>{s.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {!resuelta && (
        <div className="pqa-seguimiento">
          <label htmlFor="pqa-seguimiento" className="form-label">Agregar información adicional</label>
          <textarea
            id="pqa-seguimiento"
            rows={3}
            className="form-control"
            placeholder="Puedes añadir detalles adicionales mientras esperas respuesta..."
            maxLength={1000}
            value={seguimiento}
            onChange={(e) => setSeguimiento(e.target.value)}
          />
        </div>
      )}
    </ModalBase>
  );
}
