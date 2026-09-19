// src/components/Horarios/ModalCompetencia.jsx
import React, { useRef, useEffect } from "react";
import { nivelesCompetencia, comprimirImagen } from "./horariosData";

/**
 * Modal genérico de competencia. Se usa tanto para "Registrar" como para
 * "Modificar" — el modo se controla con la prop `modo`.
 */
export default function ModalCompetencia({
  abierto,
  modo, // "registrar" | "modificar"
  form,
  setForm,
  onCerrar,
  onGuardar,
}) {
  const inputImagenRef = useRef(null);
  const primerCampoRef = useRef(null);

  useEffect(() => {
    if (abierto) primerCampoRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  const esRegistrar = modo === "registrar";

  const previsualizarImagen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Se comprime antes de guardar: json-server rechaza cuerpos > 100 KB
    comprimirImagen(file, 600, 0.7)
      .then((dataUrl) => setForm((f) => ({ ...f, imagen: dataUrl })))
      .catch(() => alert("No se pudo procesar la imagen. Intenta con otra."));
  };

  return (
    <div
      className="superposicion-modal d-flex align-items-center justify-content-center"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="contenedor-modal">
        <div className="encabezado-modal">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-trophy text-white" />
            <h2>{esRegistrar ? "Registrar Nueva Competencia" : "Modificar Competencia"}</h2>
          </div>
        </div>

        <form onSubmit={onGuardar}>
          <div className="cuerpo-modal">
            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-nombre">
                Nombre del Torneo
              </label>
              <input
                ref={primerCampoRef}
                id="comp-nombre"
                type="text"
                className="campo-formulario"
                required
                placeholder="Ej: Copa Nacional CheerClick"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              />
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-fecha">
                Fecha de la Competencia
              </label>
              <input
                id="comp-fecha"
                type="date"
                className="campo-formulario"
                required
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
              />
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-ciudad">
                Ciudad / Lugar
              </label>
              <input
                id="comp-ciudad"
                type="text"
                className="campo-formulario"
                required
                placeholder="Ej: Bogotá — Coliseo El Campín"
                value={form.ciudad}
                onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
              />
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-costo">
                Costo de Inscripción (COP)
              </label>
              <div className="campo-con-prefijo">
                <span className="prefijo-campo">$</span>
                <input
                  id="comp-costo"
                  type="number"
                  className="campo-formulario campo-con-simbolo"
                  required
                  min="0"
                  step="1000"
                  value={form.costo}
                  onChange={(e) => setForm((f) => ({ ...f, costo: e.target.value }))}
                />
              </div>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-limite">
                Fecha Límite de Pago
              </label>
              <input
                id="comp-limite"
                type="date"
                className="campo-formulario"
                required
                value={form.limite}
                onChange={(e) => setForm((f) => ({ ...f, limite: e.target.value }))}
              />
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-nivel">
                Nivel al que Está Dirigido
              </label>
              <select
                id="comp-nivel"
                className="campo-formulario"
                required
                value={form.nivel}
                onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value }))}
              >
                {esRegistrar && (
                  <option value="" disabled>
                    Selecciona un nivel…
                  </option>
                )}
                {nivelesCompetencia.map((n) => (
                  <option key={n.valor} value={n.valor}>
                    {n.etiqueta}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-imagen">
                {esRegistrar ? "Imagen del Torneo" : "Imagen Oficial del Torneo"}{" "}
                <span className="etiqueta-opcional">(opcional)</span>
              </label>
              <div
                className="zona-imagen-torneo"
                onClick={() => inputImagenRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <figure className="figura-preview-torneo mb-0">
                  {form.imagen ? (
                    <img src={form.imagen} alt="Vista previa" />
                  ) : (
                    <figcaption className="placeholder-img-torneo d-flex flex-column align-items-center gap-2">
                      <i className="bi bi-image" />
                      <span className="texto-principal-subida">Haz clic para subir imagen</span>
                      <span className="pista-subida">JPG, PNG, WEBP · MÁX 5 MB</span>
                    </figcaption>
                  )}
                </figure>
                <input
                  id="comp-imagen"
                  ref={inputImagenRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={previsualizarImagen}
                />
              </div>
            </div>

            <div className="grupo-formulario">
              <label className="etiqueta-formulario" htmlFor="comp-link">
                Link de Publicidad <span className="etiqueta-opcional">(opcional)</span>
              </label>
              <div className="campo-con-prefijo">
                <span className="prefijo-campo prefijo-icono">
                  <i className="bi bi-link-45deg" />
                </span>
                <input
                  id="comp-link"
                  type="url"
                  className="campo-formulario campo-con-icono"
                  placeholder="https://ejemplo.com/torneo"
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="pie-modal">
            <button type="button" className="btn-cancelar-modal" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-modal">
              {esRegistrar ? "Registrar Competencia" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
