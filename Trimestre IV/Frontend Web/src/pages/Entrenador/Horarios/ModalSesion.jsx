// src/components/Horarios/ModalSesion.jsx
import React, { useEffect, useRef } from "react";

/**
 * props:
 *  - abierto
 *  - subtitulo : "Miércoles, 22 de abril"
 *  - form, setForm
 *  - onCerrar, onGuardar
 */
export default function ModalSesion({ abierto, subtitulo, form, setForm, onCerrar, onGuardar }) {
  const primerCampoRef = useRef(null);

  useEffect(() => {
    if (abierto) primerCampoRef.current?.focus();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alEscape = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alEscape);
    return () => document.removeEventListener("keydown", alEscape);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const estados = [
    { valor: "activa", texto: "Activa", icono: "bi-check-lg", clase: "pastilla-activa" },
    { valor: "cancelada", texto: "Cancelada", icono: "bi-x-lg", clase: "pastilla-cancelada" },
    { valor: "suspendida", texto: "Suspendida", icono: "bi-pause-fill", clase: "pastilla-suspendida" },
  ];

  return (
    <div
      className="fondo-modal activo"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="tarjeta-modal">
        <div className="encabezado-modal-sesion">
          <div className="info-encabezado-modal">
            <div className="fila-titulo-modal">
              <i className="bi bi-pencil" />
              <h3 className="titulo-modal">Editar Sesión</h3>
            </div>
            <p className="subtitulo-fecha-modal">{subtitulo}</p>
          </div>
          <button className="btn-cerrar-modal" onClick={onCerrar} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="cuerpo-modal">
          {/* Estado */}
          <div className="seccion-formulario">
            <p className="etiqueta-formulario">Estado de la sesión</p>
            <div className="pastillas-estado" role="radiogroup">
              {estados.map((e) => (
                <label className="pastilla-estado" key={e.valor}>
                  <input
                    type="radio"
                    name="estado-sesion"
                    value={e.valor}
                    checked={form.estado === e.valor}
                    onChange={() => setForm((f) => ({ ...f, estado: e.valor }))}
                  />
                  <span className={`contenido-pastilla ${e.clase}`}>
                    <i className={`bi ${e.icono}`} />
                    {e.texto}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Horario */}
          <div className="seccion-formulario">
            <label className="etiqueta-formulario">Horario de la sesión</label>
            <div className="fila-formulario-2">
              <div className="campo-grupo">
                <label className="etiqueta-campo" htmlFor="hora-inicio">Hora inicio</label>
                <input
                  ref={primerCampoRef}
                  id="hora-inicio"
                  type="time"
                  className="entrada-formulario"
                  value={form.horaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                />
              </div>
              <div className="campo-grupo">
                <label className="etiqueta-campo" htmlFor="hora-fin">Hora fin</label>
                <input
                  id="hora-fin"
                  type="time"
                  className="entrada-formulario"
                  value={form.horaFin}
                  onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Enfoque */}
          <div className="seccion-formulario">
            <label className="etiqueta-formulario" htmlFor="enfoque-sesion">Enfoque de la sesión</label>
            <div className="contenedor-icono-entrada">
              <i className="bi bi-person" />
              <input
                id="enfoque-sesion"
                type="text"
                className="entrada-formulario con-icono"
                placeholder="Ej: Partner + Gimnasia"
                value={form.enfoque}
                onChange={(e) => setForm((f) => ({ ...f, enfoque: e.target.value }))}
              />
            </div>
          </div>

          {/* Lugar */}
          <div className="seccion-formulario">
            <label className="etiqueta-formulario" htmlFor="lugar-sesion">
              Lugar / Instalación <span className="formulario-opcional">(opcional)</span>
            </label>
            <div className="contenedor-icono-entrada">
              <i className="bi bi-geo-alt" />
              <input
                id="lugar-sesion"
                type="text"
                className="entrada-formulario con-icono"
                placeholder="Ej: Gimnasio Principal, Sala B"
                value={form.lugar}
                onChange={(e) => setForm((f) => ({ ...f, lugar: e.target.value }))}
              />
            </div>
          </div>

          {/* Notas */}
          <div className="seccion-formulario">
            <label className="etiqueta-formulario" htmlFor="notas-sesion">
              Notas / Observaciones <span className="formulario-opcional">(opcional)</span>
            </label>
            <textarea
              id="notas-sesion"
              className="area-texto"
              rows={3}
              placeholder="Indicaciones especiales, temas a trabajar, materiales…"
              value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            />
          </div>
        </div>

        <div className="pie-modal">
          <button className="btn-cancelar-modal" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-guardar-modal" onClick={onGuardar}>
            <i className="bi bi-save" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
