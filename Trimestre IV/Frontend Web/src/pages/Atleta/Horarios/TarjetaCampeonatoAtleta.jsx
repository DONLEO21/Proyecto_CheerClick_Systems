// src/components/Horarios/TarjetaCampeonatoAtleta.jsx
import React from "react";
import { formatearFechaCorta, formatearMoneda } from "./horariosAtletaData";

export default function TarjetaCampeonatoAtleta({ torneo, onVerDetalles, onPagar }) {
  return (
    <article className="tarjeta-campeonato" role="listitem">
      <figure className="imagen-campeonato">
        {torneo.imagen ? (
          <img src={torneo.imagen} alt={torneo.nombre} />
        ) : (
          <div className="placeholder-imagen-campeonato">
            <i className="bi bi-trophy" />
          </div>
        )}
      </figure>
      <div className="cuerpo-tarjeta-campeonato">
        <header className="cabecera-info-campeonato">
          <h3 className="nombre-campeonato">{torneo.nombre}</h3>
          <time className="fecha-campeonato">{formatearFechaCorta(torneo.fecha)}</time>
        </header>
        <p className="ciudad-campeonato"><i className="bi bi-geo-alt" /> {torneo.ciudad}</p>
        <p className="costo-campeonato">{formatearMoneda(torneo.costo)} inscripción</p>
      </div>
      <footer className="acciones-campeonato">
        <button className="btn-detalles-campeonato" type="button" onClick={() => onVerDetalles(torneo)}>
          Ver detalles
        </button>
        <button className="btn-pagar-campeonato" type="button" onClick={() => onPagar(torneo)}>
          <i className="bi bi-credit-card" /> Pagar
        </button>
      </footer>
    </article>
  );
}
