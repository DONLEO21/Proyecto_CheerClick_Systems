
import React from "react";
import FilaPqrs from "./FilaPqrs";

const COLUMNAS = ["ID", "ASUNTO", "ESTADO", "PRIORIDAD", "FECHA", "REMITENTE", "ACCIONES"];

export default function TablaPqrs({ filas, onResponder, onModificar, onInhabilitar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle text-center mb-0 pqrs-tabla">
        <thead>
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} scope="col">{columna}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={COLUMNAS.length} className="pqrs-vacio">
                No hay PQRS que coincidan con los filtros. Pulsa "Todos" para ver el listado completo.
              </td>
            </tr>
          ) : (
            filas.map((pqrs) => (
              <FilaPqrs
                key={pqrs.id}
                pqrs={pqrs}
                onResponder={onResponder}
                onModificar={onModificar}
                onInhabilitar={onInhabilitar}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
