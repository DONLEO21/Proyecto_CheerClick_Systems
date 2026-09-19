// src/components/Horarios/ModalNivel.jsx
import React, { useRef, useEffect } from "react";
import { diasSemana, etiquetaDias, comprimirImagen } from "./horariosData";

// Un bloque de horario vacío: sus propios días + su propio rango de hora
const BLOQUE_VACIO = () => ({ dias: [], inicio: "18:00", fin: "20:00" });

export default function ModalNivel({ abierto, formNivel, setFormNivel, onCerrar, onGuardar }) {
  const inputFotoRef = useRef(null);
  const primerCampoRef = useRef(null);

  // Enfoca el primer campo cada vez que se abre el modal.
  useEffect(() => {
    if (abierto) primerCampoRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  // ── Manejo de cada bloque de horario (días + hora propios) ──
  const alternarDiaDelBloque = (idxBloque, dia) => {
    setFormNivel((f) => {
      const horarios = f.horarios.map((b, i) => {
        if (i !== idxBloque) return b;
        const dias = b.dias.includes(dia) ? b.dias.filter((d) => d !== dia) : [...b.dias, dia];
        return { ...b, dias };
      });
      return { ...f, horarios };
    });
  };

  const cambiarHoraBloque = (idxBloque, campo, valor) => {
    setFormNivel((f) => {
      const horarios = f.horarios.map((b, i) => (i === idxBloque ? { ...b, [campo]: valor } : b));
      return { ...f, horarios };
    });
  };

  const agregarBloque = () =>
    setFormNivel((f) => ({ ...f, horarios: [...f.horarios, BLOQUE_VACIO()] }));

  const quitarBloque = (idxBloque) => {
    setFormNivel((f) => {
      if (f.horarios.length <= 1) return f;
      return { ...f, horarios: f.horarios.filter((_, i) => i !== idxBloque) };
    });
  };

  const previsualizarFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Se comprime antes de guardar: json-server rechaza cuerpos muy grandes
    comprimirImagen(file, 400, 0.7)
      .then((dataUrl) => setFormNivel((f) => ({ ...f, foto: dataUrl })))
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
            <i className="bi bi-pencil-square text-white" />
            <h2>{formNivel.id !== null ? "Editar Horario" : "Nuevo Nivel"}</h2>
          </div>
        </div>

        <div className="cuerpo-modal">
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="modal-categoria">
              Nombre del Nivel
            </label>
            <input
              ref={primerCampoRef}
              id="modal-categoria"
              type="text"
              className="campo-formulario"
              placeholder="Ej: Nivel 1.1 Formativo"
              value={formNivel.categoria}
              onChange={(e) => setFormNivel((f) => ({ ...f, categoria: e.target.value }))}
            />
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario">Foto del Entrenador</label>
            <div className="zona-subida-foto" onClick={() => inputFotoRef.current?.click()}>
              <div className="contenedor-vista-previa">
                {formNivel.foto && <img src={formNivel.foto} alt="Vista previa" />}
              </div>
              <div>
                <p className="texto-principal-subida mb-0">Haz clic para subir foto</p>
                <p className="pista-subida mb-0">JPG, PNG · MÁX 5 MB</p>
              </div>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={previsualizarFoto}
              />
            </div>
          </div>

          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="modal-entrenador">
              Nombre del Entrenador
            </label>
            <input
              id="modal-entrenador"
              type="text"
              className="campo-formulario"
              placeholder="Ej: Jonathan Cruz"
              value={formNivel.entrenador}
              onChange={(e) => setFormNivel((f) => ({ ...f, entrenador: e.target.value }))}
            />
          </div>

          {/* ── Bloques de horario: cada uno con SUS PROPIOS días ── */}
          <div className="grupo-formulario">
            <label className="etiqueta-formulario">Horarios</label>
            <p className="pista-subida mb-2" style={{ marginTop: -6 }}>
              Si el nivel entrena distinto algún día (por ejemplo sábado a otra hora),
              agrégalo como un horario aparte en vez de mezclarlo con los demás.
            </p>

            <div className="d-flex flex-column gap-3">
              {formNivel.horarios.map((bloque, idx) => (
                <div className="bloque-horario" key={idx}>
                  <div className="selector-dias selector-dias--bloque">
                    {diasSemana.map((dia) => (
                      <button
                        key={dia}
                        type="button"
                        className={`btn-dia ${bloque.dias.includes(dia) ? "activo" : ""}`}
                        onClick={() => alternarDiaDelBloque(idx, dia)}
                      >
                        {etiquetaDias[dia].slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="fila-horario fila-horario--bloque">
                    <input
                      type="time"
                      className="campo-formulario"
                      value={bloque.inicio}
                      onChange={(e) => cambiarHoraBloque(idx, "inicio", e.target.value)}
                    />
                    <span className="separador-hora">–</span>
                    <input
                      type="time"
                      className="campo-formulario"
                      value={bloque.fin}
                      onChange={(e) => cambiarHoraBloque(idx, "fin", e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-quitar-horario"
                      title="Eliminar este horario"
                      onClick={() => quitarBloque(idx)}
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn-agregar-horario mt-2" onClick={agregarBloque}>
              + Agregar Horario
            </button>
          </div>
        </div>

        <div className="pie-modal">
          <button type="button" className="btn-cancelar-modal" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="button" className="btn-guardar-modal" onClick={onGuardar}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
