export default function FilaAtleta({
  atleta,
  estado,
  motivo,
  bloqueada,
  menuAbierto,
  onMarcar,
  onToggleMenu,
  onSeleccionEstado,
}) {
  return (
    <tr>
      <td>{atleta.nombre}</td>
      <td>{atleta.apellido}</td>
      <td>
        {estado && (
          <span
            className={`estado-badge estado-${estado}`}
            title={estado === "justificado" && motivo ? motivo : undefined}
          >
            {etiquetaEstado(estado)}
          </span>
        )}
      </td>
      <td className="acciones-cell d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn-accion btn-presente"
          title="Presente"
          disabled={bloqueada}
          onClick={() => onMarcar("presente")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
        <button
          type="button"
          className="btn-accion btn-falta"
          title="Falta"
          disabled={bloqueada}
          onClick={() => onMarcar("falta")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="dropdown">
          <button
            type="button"
            className="btn-accion btn-mas"
            title="Más opciones"
            disabled={bloqueada}
            onClick={onToggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <div className={`dropdown-menu dropdown-menu-end${menuAbierto ? " show" : ""}`}>
            <button type="button" className="dropdown-item d-flex align-items-center gap-2" onClick={() => onSeleccionEstado("inpuntual")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              Inpuntual
            </button>
            <button type="button" className="dropdown-item d-flex align-items-center gap-2" onClick={() => onSeleccionEstado("justificado")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Justificado
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function etiquetaEstado(estado) {
  switch (estado) {
    case "presente": return "Presente";
    case "falta": return "Falta";
    case "inpuntual": return "Inpuntual";
    case "justificado": return "Justificado";
    default: return "";
  }
}
