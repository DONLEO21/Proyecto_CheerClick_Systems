function FiltrosHabilidades({
  busqueda,
  setBusqueda,
  nivelSeleccionado,
  setNivelSeleccionado,
  tipoSeleccionado,
  setTipoSeleccionado,
  onNuevaHabilidad,
}) {
  return (
    <section id="filtros-h" className="container my-3">
      <div className="row g-3 align-items-center">
        <div className="col-md-4">
          <input
            type="search"
            placeholder="Buscar Habilidad..."
            className="search-input-h form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="select-h form-select"
            value={nivelSeleccionado}
            onChange={(e) => setNivelSeleccionado(e.target.value)}
          >
            <option value="">Nivel</option>
            <option value="Nivel 1 Youth">Nivel 1 Youth</option>
            <option value="Nivel 3 Open">Nivel 3 Open</option>
            <option value="Nivel 4 Open Large">Nivel 4 Open Large</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="select-h form-select"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="apropiada">Apropiadas</option>
            <option value="avanzada">Avanzadas</option>
            <option value="elite">Élite</option>
            <option value="inhabilitada">Inhabilitadas</option>
          </select>
        </div>

        <div className="col-md-2 text-end" id="conte-new">
          <button onClick={onNuevaHabilidad} id="btn-habil">
            <svg
              id="habil"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Nueva habilidad
          </button>
        </div>
      </div>
    </section>
  );
}

export default FiltrosHabilidades;