
import React from "react";
import ModalBase from "./ModalBase";
import { TIPOS, radicadoDe } from "./pqrsData";

export default function ModalNuevaPqrs({
  abierto,
  editando,
  form,
  setForm,
  enviando,
  onCerrar,
  onGuardar,
}) {
  if (!abierto) return null;

  const cambiar = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const nombreArchivo = form.archivo ? form.archivo.name : form.evidencia;

  return (
    <ModalBase
      titulo={editando ? "Editar PQRS" : "Registrar nueva PQRS"}
      subtitulo={
        editando
          ? `Actualiza los datos de tu solicitud ${radicadoDe(editando)}.`
          : "Cuéntanos qué necesitas. Tu entrenador y el equipo administrativo revisarán tu solicitud."
      }
      enviando={enviando}
      onCerrar={onCerrar}
      onSubmit={onGuardar}
      pie={
        <>
          <button type="button" className="btn pqa-btn-cancelar" disabled={enviando} onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="btn pqa-btn-primario" disabled={enviando}>
            {enviando ? (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            ) : (
              <i className={`bi ${editando ? "bi-save" : "bi-send"}`} aria-hidden="true" />
            )}
            {editando ? "Guardar cambios" : "Enviar solicitud"}
          </button>
        </>
      }
    >
      <div className="mb-3">
        <label htmlFor="pqa-tipo" className="form-label">Tipo de solicitud</label>
        <select id="pqa-tipo" className="form-select" value={form.tipo} onChange={cambiar("tipo")}>
          <option value="" disabled>Selecciona el tipo de solicitud</option>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="pqa-asunto" className="form-label">Asunto</label>
        <input
          id="pqa-asunto"
          type="text"
          className="form-control"
          placeholder="Ej. Cambio de horario de entrenamiento"
          maxLength={120}
          value={form.asunto}
          onChange={cambiar("asunto")}
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label htmlFor="pqa-descripcion" className="form-label">Descripción</label>
        <textarea
          id="pqa-descripcion"
          rows={5}
          className="form-control"
          placeholder="Describe tu solicitud con el mayor detalle posible"
          maxLength={1000}
          value={form.descripcion}
          onChange={cambiar("descripcion")}
        />
      </div>

      <div>
        <span className="form-label d-block">Adjuntar evidencia</span>
        <div className="pqa-adjunto">
          <label htmlFor="pqa-archivo" className="pqa-btn-archivo">
            <i className="bi bi-paperclip" aria-hidden="true" />
            Seleccionar archivo
          </label>
          <input
            id="pqa-archivo"
            type="file"
            className="visually-hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, archivo: e.target.files?.[0] ?? null }))
            }
          />
          <span className="pqa-sin-archivo">{nombreArchivo || "Ningún archivo seleccionado"}</span>
        </div>
        <p className="pqa-nota">Opcional. PDF, JPG o PNG, máx. 5 MB.</p>
      </div>
    </ModalBase>
  );
}
