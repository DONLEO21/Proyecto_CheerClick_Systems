// src/components/Horarios/TarjetaEntrenamiento.jsx
import React from "react";
import { CATEGORIAS, formatearFechaLarga, obtenerInsignia, esPasada, a12h } from "./horariosAtletaData";

export default function TarjetaEntrenamiento({ sesion, onVerDetalles }) {
  const cat = CATEGORIAS[sesion.cat];
  const hoy = new Date();
  const pasada = esPasada(sesion.fecha, hoy);
  const insignia = obtenerInsignia(sesion.fecha, hoy);

  const claseInsignia =
    insignia === "HOY" ? "insignia-hoy" : insignia === "PASADO" ? "insignia-pasado" : "insignia-proximo";

  return (
    <article className={`tarjeta-entrenamiento ${pasada ? "tarjeta-pasada" : ""}`} role="listitem">
      <header className={`cabecera-tarjeta ${pasada ? "cabecera-pasado" : cat.clase}`}>
        <div className="fila-superior">
          <span className={`insignia ${claseInsignia}`}>{insignia}</span>
          <span className="pastilla-duracion">
            <i className="bi bi-clock" /> {sesion.duracion}
          </span>
        </div>
        <div className="fila-categoria">
          <div className="icono-categoria-contenedor">
            <i className={`bi ${cat.icono}`} />
          </div>
          <span className="nombre-categoria">{cat.nombre}</span>
        </div>
      </header>

      <div className="cuerpo-tarjeta">
        <div className="fila-info">
          <span className="icono-info"><i className="bi bi-calendar3" /></span>
          <span className="texto-info">{formatearFechaLarga(sesion.fecha)}</span>
        </div>
        <div className="fila-info">
          <span className="icono-info"><i className="bi bi-clock" /></span>
          <span className="texto-info">
            <strong>{a12h(sesion.horaInicio)}</strong> – {a12h(sesion.horaFin)}
          </span>
        </div>
        <div className="fila-info fila-entrenador">
          <div className={`avatar-entrenador ${pasada ? "avatar-pasado" : cat.clase}`}>{sesion.iniciales}</div>
          <div className="info-entrenador-atleta">
            <span className="nombre-entrenador">{sesion.entrenador}</span>
            <span className="rol-entrenador">Entrenador principal</span>
          </div>
        </div>
      </div>

      <footer className="pie-tarjeta">
        <button className="btn-detalles" type="button" onClick={() => onVerDetalles(sesion)}>
          Ver detalles <i className="bi bi-arrow-right" />
        </button>
      </footer>
    </article>
  );
}
