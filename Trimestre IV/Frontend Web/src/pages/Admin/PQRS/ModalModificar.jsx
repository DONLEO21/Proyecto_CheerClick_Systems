
import React from "react";
import ModalBase from "./ModalBase";
import { ESTADOS, PRIORIDADES, TIPOS } from "./pqrsData";

export default function ModalModificar({ abierto, pqrs, form, setForm, enviando, onCerrar, onGuardar }) {
  if (!abierto || !pqrs) return null;

  const cambiar = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  return (
    <ModalBase
      titulo="Modificar PQRS"
      subtitulo="Ajusta el tipo, asunto, descripción, estado o prioridad de la solicitud."
      textoAccion="Guardar cambios"
      iconoAccion="bi-save"
      enviando={enviando}
      onCerrar={onCerrar}
      onSubmit={onGuardar}
    >
      <div className="mb-3">
        <label htmlFor="modificar-tipo" className="form-label">Tipo de solicitud</label>
        <select id="modificar-tipo" className="form-select" value={form.tipo} onChange={cambiar("tipo")}>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="modificar-asunto" className="form-label">Asunto</label>
        <input
          id="modificar-asunto"
          type="text"
          className="form-control"
          value={form.asunto}
          onChange={cambiar("asunto")}
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label htmlFor="modificar-descripcion" className="form-label">Descripción</label>
        <textarea
          id="modificar-descripcion"
          rows={4}
          className="form-control"
          value={form.descripcion}
          onChange={cambiar("descripcion")}
        />
      </div>

      <div className="row g-3">
        <div className="col-6">
          <label htmlFor="modificar-estado" className="form-label">Estado</label>
          <select id="modificar-estado" className="form-select" value={form.estado} onChange={cambiar("estado")}>
            {ESTADOS.map((e) => (
              <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
            ))}
          </select>
        </div>

        <div className="col-6">
          <label htmlFor="modificar-prioridad" className="form-label">Prioridad</label>
          <select
            id="modificar-prioridad"
            className="form-select"
            value={form.prioridad}
            onChange={cambiar("prioridad")}
          >
            {PRIORIDADES.map((p) => (
              <option key={p.valor} value={p.valor}>{p.etiqueta}</option>
            ))}
          </select>
        </div>
      </div>
    </ModalBase>
  );
}
