function Filtros({ busqueda, setBusqueda, nivelSeleccionado, setNivelSeleccionado, onGestionarHabilidades }) {
  return (
    <section id="filtros" className="container my-3">
      <div className="row g-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            placeholder="Buscar Atleta..."
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            name="Estado"
            className="select form-select"
            value={nivelSeleccionado}
            onChange={(e) => setNivelSeleccionado(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            <option value="Nivel Formativo King">Nivel Formativo King</option>
            <option value="Nivel 3 Magic">Nivel 3 Magic</option>
            <option value="Nivel 1 Princess">Nivel 1 Princess</option>
            <option value="Nivel 4 Blood Tigers">Nivel 4 Blood Tigers</option>
            <option value="Nivel 1 Queen">Nivel 1 Queen</option>
          </select>
        </div>

        <div className="col-md-4 text-md-end">
          {/* Se eliminó la etiqueta <a> y se agregó onClick al button */}
          <button 
            id="btn-habil" 
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={onGestionarHabilidades}
          >
            <svg
              id="habil"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.013 18.582 6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904L20 11.5" />
              <path d="M15 18h6" />
              <path d="M18 15v6" />
            </svg>
            Gestión de Habilidades
          </button>
        </div>
      </div>
    </section>
  );
}

export default Filtros;