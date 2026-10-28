
import React from "react";
import { ESTADOS, PRIORIDADES, etiquetaDe, radicadoDe } from "./pqrsData";

const formatearFecha = (iso) => {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
};

export default function FilaPqrs({ pqrs, onResponder, onModificar, onInhabilitar }) {
  const inhabilitada = pqrs.inhabilitada;
  const resuelta = pqrs.estado === "resuelto";

  const motivoResponder = inhabilitada
    ? "Habilita la PQRS para poder responderla"
    : resuelta
    ? "Esta PQRS ya fue resuelta"
    : undefined;

  return (
    <tr className={inhabilitada ? "pqrs-fila--inhabilitada" : ""}>
      <td>{radicadoDe(pqrs)}</td>
      <td>{pqrs.asunto}</td>
      <td>
        <span className={`pqrs-insignia pqrs-estado--${pqrs.estado}`}>
          {etiquetaDe(ESTADOS, pqrs.estado)}
        </span>
      </td>
      <td>
        <span className={`pqrs-insignia pqrs-prioridad--${pqrs.prioridad}`}>
          {etiquetaDe(PRIORIDADES, pqrs.prioridad)}
        </span>
      </td>
      <td>
        <time dateTime={pqrs.fecha}>{formatearFecha(pqrs.fecha)}</time>
      </td>
      <td>{pqrs.remitente}</td>
      <td>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-sm pqrs-btn-accion"
            disabled={inhabilitada || resuelta}
            title={motivoResponder}
            onClick={() => onResponder(pqrs)}
          >
            Responder
          </button>
          <button
            type="button"
            className="btn btn-sm pqrs-btn-accion"
            disabled={inhabilitada}
            onClick={() => onModificar(pqrs)}
          >
            Modificar
          </button>
          <button
            type="button"
            className="btn btn-sm pqrs-btn-accion"
            onClick={() => onInhabilitar(pqrs)}
          >
            {inhabilitada ? "Habilitar" : "Inhabilitar"}
          </button>
        </div>
      </td>
    </tr>
  );
}
