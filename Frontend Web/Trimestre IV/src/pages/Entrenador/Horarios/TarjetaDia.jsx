// src/components/Horarios/TarjetaDia.jsx
import React from "react";
import { formatearRangoHora, etiquetaFechaLarga, esHoy, DIAS_ES } from "./calendarioData";

export default function TarjetaDia({
  anio,
  mes,
  dia,
  sesion,
  hayEntrenamiento,
  diasEntrenamiento,
  onMarcarAsistencia,
  onEditarSesion,
}) {
  const nombresDias = diasEntrenamiento
    .map((n) => {
      const d = DIAS_ES[n];
      return d.charAt(0).toUpperCase() + d.slice(1);
    })
    .join(", ");

  return (
    <section className="tarjeta tarjeta-dia">
      <div className="encabezado-tarjeta-dia">
        <div className="encabezado-dia-izquierda">
          <span className="etiqueta-dia">{etiquetaFechaLarga(anio, mes, dia)}</span>
          {sesion?.tipos?.length > 0 && (
            <span className="indicador-guardado">
              <i className="bi bi-check-lg" />
              Guardado
            </span>
          )}
        </div>
        <div className="encabezado-dia-derecha">
          {esHoy(anio, mes, dia) && <span className="etiqueta-hoy">Hoy</span>}
        </div>
      </div>

      {hayEntrenamiento ? (
        <div>
          {sesion.estado !== "activa" && (
            <div className={`banner-estado banner-${sesion.estado}`}>
              <i className="bi bi-exclamation-circle" />
              <span>{sesion.estado === "cancelada" ? "Sesión cancelada" : "Sesión suspendida"}</span>
            </div>
          )}

          <div className="lista-detalles">
            <div className="elemento-detalle">
              <span className="icono-detalle"><i className="bi bi-clock" /></span>
              <span>{formatearRangoHora(sesion.horaInicio, sesion.horaFin)}</span>
            </div>

            <div className="elemento-detalle">
              <span className="icono-detalle"><i className="bi bi-person" /></span>
              <span>{sesion.enfoque || "—"}</span>
            </div>

            <div className="elemento-detalle">
              <span className="icono-detalle"><i className="bi bi-bullseye" /></span>
              <span>{sesion.tipos?.length ? sesion.tipos.join(", ") : "—"}</span>
            </div>

            {sesion.lugar && (
              <div className="elemento-detalle">
                <span className="icono-detalle"><i className="bi bi-geo-alt" /></span>
                <span>{sesion.lugar}</span>
              </div>
            )}

            {sesion.notas && (
              <div className="elemento-detalle">
                <span className="icono-detalle"><i className="bi bi-file-text" /></span>
                <span className="texto-notas">{sesion.notas}</span>
              </div>
            )}
          </div>

          <div className="acciones-tarjeta-dia">
            <button
              className={`btn-marcar ${sesion.asistenciaMarcada ? "marcada" : ""}`}
              onClick={onMarcarAsistencia}
            >
              <i className="bi bi-check-lg" />
              {sesion.asistenciaMarcada ? "Asistencia marcada" : "Marcar asistencia"}
            </button>

            <button className="btn-editar-horario" onClick={onEditarSesion}>
              <i className="bi bi-pencil" />
              Editar sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="mensaje-sin-entrenamiento">
          <i className="bi bi-calendar-x" style={{ fontSize: "2.2rem" }} />
          <p>No hay entrenamiento programado.</p>
          <small>
            Los entrenamientos son <strong>{nombresDias || "—"}</strong>.
          </small>
        </div>
      )}
    </section>
  );
}
