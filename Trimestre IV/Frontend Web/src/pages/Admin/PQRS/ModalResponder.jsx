// src/pages/Admin/PQRS/ModalResponder.jsx
import React from "react";
import ModalBase from "./ModalBase";
import { ESTADOS, radicadoDe } from "./pqrsData";

// Al responder, la PQRS ya no puede quedar en "Pendiente"
const ESTADOS_RESPUESTA = ESTADOS.filter((e) => e.valor !== "pendiente");

export default function ModalResponder({ abierto, pqrs, form, setForm, enviando, onCerrar, onGuardar }) {
  if (!abierto || !pqrs) return null;

  const cambiar = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  return (
    <ModalBase
      titulo="Responder PQRS"
      subtitulo={`Radicado ${radicadoDe(pqrs)} · ${pqrs.remitente}`}
      icono="bi-chat-square"
      textoAccion="Enviar respuesta"
      iconoAccion="bi-send"
      enviando={enviando}
      onCerrar={onCerrar}
      onSubmit={onGuardar}
    >
      <div className="pqrs-mensaje mb-4">
        <strong>{pqrs.asunto}</strong>
        <p>{pqrs.descripcion}</p>
      </div>

      {pqrs.seguimientos?.length > 0 && (
        <div className="pqrs-mensaje mb-4">
          <strong>Información adicional del atleta</strong>
          {pqrs.seguimientos.map((s, i) => (
            <p key={i}>
              {s.fecha.split("-").reverse().join("/")} · {s.texto}
            </p>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="responder-texto" className="form-label">Respuesta para el atleta</label>
        <textarea
          id="responder-texto"
          rows={5}
          className="form-control"
          placeholder="Escribe la respuesta que verá el atleta..."
          value={form.respuesta}
          onChange={cambiar("respuesta")}
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="responder-estado" className="form-label">Dejar la PQRS en estado</label>
        <select
          id="responder-estado"
          className="form-select"
          value={form.estado}
          onChange={cambiar("estado")}
        >
          {ESTADOS_RESPUESTA.map((e) => (
            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
          ))}
        </select>
      </div>
    </ModalBase>
  );
}
