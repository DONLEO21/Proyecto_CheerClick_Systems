function IconoEditar() {
  return (
    <svg width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
    </svg>
  );
}
function IconoEliminar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fw-bold">
      <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
    </svg>
  );
}
function IconoHabilitar() {
  return (
    <svg width="16" height="16" fill="currentColor" class="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
    </svg>
  );
}

export default function ImplementoRow({ implemento, onEditar, onPedirCambioEstado }) {
  const disponible = implemento.estado === "Disponible";

  return (
    <tr className={!disponible ? "fila-no-disponible" : ""}>
      <td>{implemento.id}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={implemento.imagen || "/img/placeholder.png"}
            alt={implemento.nombre}
            className="img-producto"
          />
          <span className="fw-semibold">{implemento.nombre}</span>
        </div>
      </td>
      <td>{implemento.tipo}</td>
      <td>{implemento.cantidad}</td>
      <td>${Number(implemento.precio).toLocaleString("es-CO")}</td>
      <td>
        <span className={`badge-pastilla ${disponible ? "badge-verde" : "badge-roja"}`}>
          {implemento.estado}
        </span>
      </td>
      <td className="text-end">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn-accion-cuadrado btn-accion-editar"
            title="Editar"
            disabled={!disponible}
            onClick={() => onEditar(implemento)}
          >
            <IconoEditar />
          </button>

          <button
            type="button"
            className={`btn-accion-cuadrado ${disponible ? "btn-accion--x" : "btn-accion--check"}`}
            title={disponible ? "Inhabilitar" : "Habilitar"}
            onClick={() => onPedirCambioEstado(implemento)}
          >
            {disponible ? <IconoEliminar /> : <IconoHabilitar />}
          </button>
        </div>
      </td>
    </tr>
  );
}