
import React from "react";
import { ESTADOS, PRIORIDADES, TIPOS } from "./pqrsData";

export default function FiltrosPqrs({ filtros, onCambio, onLimpiar }) {
  const cambiar = (campo) => (e) => onCambio(campo, e.target.value);
  const escribir = (e) => onCambio("busqueda", e.target.value);

  const buscar = (e) => e.preventDefault();

  return (
    <div className="pqrs-filtros d-flex flex-wrap align-items-center justify-content-between gap-2">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <label htmlFor="filtro-orden" className="visually-hidden">Ordenar por ID</label>
        <select
          id="filtro-orden"
          className="form-select pqrs-select"
          value={filtros.orden}
          onChange={cambiar("orden")}
        >
          <option value="">ID</option>
          <option value="asc">ID Asc</option>
          <option value="desc">ID Desc</option>
        </select>

        <label htmlFor="filtro-tipo" className="visually-hidden">Filtrar por tipo</label>
        <select
          id="filtro-tipo"
          className="form-select pqrs-select"
          value={filtros.tipo}
          onChange={cambiar("tipo")}
        >
          <option value="">Todos</option>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
          ))}
        </select>

        <label htmlFor="filtro-estado" className="visually-hidden">Filtrar por estado</label>
        <select
          id="filtro-estado"
          className="form-select pqrs-select"
          value={filtros.estado}
          onChange={cambiar("estado")}
        >
          <option value="">Estado</option>
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
          ))}
        </select>

        <label htmlFor="filtro-prioridad" className="visually-hidden">Filtrar por prioridad</label>
        <select
          id="filtro-prioridad"
          className="form-select pqrs-select"
          value={filtros.prioridad}
          onChange={cambiar("prioridad")}
        >
          <option value="">Prioridad</option>
          {PRIORIDADES.map((p) => (
            <option key={p.valor} value={p.valor}>{p.etiqueta}</option>
          ))}
        </select>

        <button type="button" className="btn pqrs-btn-primario pqrs-btn-todos" onClick={onLimpiar}>
          Todos
        </button>
      </div>

      <form className="d-flex align-items-center gap-2" role="search" onSubmit={buscar}>
        <div className="pqrs-busqueda">
          <i className="bi bi-search" aria-hidden="true" />
          <label htmlFor="filtro-busqueda" className="visually-hidden">Buscar PQRS</label>
          <input
            id="filtro-busqueda"
            type="search"
            className="form-control pqrs-input"
            placeholder="Buscar"
            value={filtros.busqueda}
            onChange={escribir}
          />
        </div>

        <button type="submit" className="btn pqrs-btn-icono" aria-label="Aplicar filtros">
          <i className="bi bi-funnel" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
