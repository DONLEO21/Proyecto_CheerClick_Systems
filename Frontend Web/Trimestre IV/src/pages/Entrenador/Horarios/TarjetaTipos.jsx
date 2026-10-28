import React, { useState } from "react";
import { TIPOS_BASE, formatearRangoHora } from "./calendarioData";
import { formatearDias } from "../../Admin/Horarios/horariosData";

const ICONO_TIPO = {
  Partner: "bi-people",
  Gimnasia: "bi-person-arms-up",
  Baile: "bi-music-note-beamed",
};

export default function TarjetaTipos({
  nivel,
  tiposSeleccionados = [],
  tiposDisponibles = TIPOS_BASE,
  deshabilitado,
  onAlternarTipo,
  onAgregarTipo,
  onGuardar,
  guardadoOk,
}) {
  const [personalizado, setPersonalizado] = useState("");

  const agregar = () => {
    const limpio = personalizado.trim();
    if (!limpio) return;
    onAgregarTipo(limpio);
    setPersonalizado("");
  };

  return (
    <section className="tarjeta tarjeta-tipo-entrenamiento">
      <div className="encabezado-tipos">
        <div>
          <h3 className="titulo-tipos">Tipo de Entrenamiento</h3>
          <p className="subtitulo-tipos">Selecciona y guarda para el día activo</p>
        </div>
        <button
          className={`btn-guardar-tipo ${guardadoOk ? "guardado-correcto" : ""}`}
          onClick={onGuardar}
          disabled={deshabilitado}
        >
          <i className="bi bi-save" />
          {guardadoOk ? "Guardado" : "Guardar"}
        </button>
      </div>

      <div className="contenedor-tipos">
        {tiposDisponibles.map((tipo) => (
          <button
            key={tipo}
            type="button"
            className={`etiqueta-tipo ${tiposSeleccionados.includes(tipo) ? "activo" : ""}`}
            onClick={() => onAlternarTipo(tipo)}
            disabled={deshabilitado}
          >
            <i className={`bi ${ICONO_TIPO[tipo] || "bi-tag"}`} />
            {tipo}
          </button>
        ))}
      </div>
      <div className="info-horario">
        <p className="titulo-info-horario">
          <i className="bi bi-clock" />
          Horario — {nivel?.categoria || "—"}
        </p>
        <div className="filas-horario">
          {nivel?.horarios?.length ? (
            nivel.horarios.map((bloque, i) => (
              <div className="fila-horario" key={i}>
                <span className="dia-horario">{formatearDias(bloque.dias)}</span>
                <span className="hora-horario">{formatearRangoHora(bloque.inicio, bloque.fin)}</span>
              </div>
            ))
          ) : (
            <div className="fila-horario">
              <span className="dia-horario">Sin horario definido</span>
            </div>
          )}
        </div>
      </div>
      <div className="fila-tipo-personalizado">
        <div className="contenedor-entrada-personalizada">
          <i className="bi bi-plus-lg" />
          <input
            type="text"
            className="entrada-tipo-personalizado"
            placeholder="Añadir tipo personalizado…"
            maxLength={40}
            value={personalizado}
            onChange={(e) => setPersonalizado(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregar()}
            disabled={deshabilitado}
          />
        </div>
        <button className="btn-agregar-personalizado" onClick={agregar} disabled={deshabilitado}>
          Añadir
        </button>
      </div>
      <div className="vista-previa-seleccion">
        <span className="etiqueta-vista-previa">Activos:</span>
        <div className="fichas-seleccionadas">
          {tiposSeleccionados.length ? (
            tiposSeleccionados.map((t) => (
              <span className="ficha" key={t}>
                {t}
              </span>
            ))
          ) : (
            <span className="ficha-vacia">Ninguno seleccionado</span>
          )}
        </div>
      </div>
    </section>
  );
}
