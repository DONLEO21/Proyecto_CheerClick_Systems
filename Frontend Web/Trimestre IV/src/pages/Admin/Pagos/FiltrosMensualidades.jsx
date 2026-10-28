function FiltrosMensualidades({
  busqueda, setBusqueda,
  estadoSeleccionado, setEstadoSeleccionado,
  mesSeleccionado, setMesSeleccionado,
  planSeleccionado, setPlanSeleccionado,
  meses, planes,
}) {
  return (
    <section id="filtros" className="container my-3">
      <div className="row g-3 align-items-center">
        <div className="col-md-4">
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
            className="select form-select"
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
          >
            <option value="">Estado</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="select form-select"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          >
            <option value="">Mes</option>
            {meses.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="select form-select"
            value={planSeleccionado}
            onChange={(e) => setPlanSeleccionado(e.target.value)}
          >
            <option value="">Plan</option>
            {planes.map((p) => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default FiltrosMensualidades;