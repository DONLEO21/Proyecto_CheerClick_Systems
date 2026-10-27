import imgusuario from "../../../assets/icons/usuario.png";

function TablaAtletas({ atletas, onVerAtleta, onEditarAtleta, onRegistrarAtleta, onEliminarAtleta }) {
    const obtenerEstiloNivel = (nivel) => {
        switch (nivel?.toLowerCase().trim()) {
        case "nivel formativo king":
          return { backgroundColor: "#dbeafe", color: "#1d4ed8" };
        case "nivel 3 magic":
          return { backgroundColor: "#f0dfff", color: "#a318ff" };
        case "nivel 1 princess":
          return { backgroundColor: "#fce4ef", color: "#fc4fc2" };
        case "nivel 4 blood tigers":
          return { backgroundColor: "#fef3c7", color: "#f59e0b" };
        case "nivel 1 queen":
          return { backgroundColor: "#fdeaea", color: "#d71920" };
        default:
          return { backgroundColor: "#495057", color: "#ffffff" };
      }
    };


  return (
    <section id="panel" className="container mt-4">
      <table id="tabla" className="table align-middle">
        <thead>
          <tr>
            <th>Atleta</th>
            <th>Edad</th>
            <th>Nivel</th>
            <th>Rendimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {atletas.length > 0 ? (
            atletas.map((atleta) => (
              <tr key={atleta.id}>
                <td>
                  <div className="conte-a d-flex align-items-center gap-2">
                    <div className="conte-inforUsu">
                      <img
                        className="img-tabla "
                        src={imgusuario}
                        alt={"Foto atleta"}
                        width="40"
                        height="40"
                      />
                    </div>
                    <div className="conte-nombre">
                      <span className="tex-tabla">{atleta.nombre}</span>
                    </div>
                  </div>
                </td>

                <td className="edad-ne">{atleta.edad}</td>

                <td>
                  <button
                    className="btn-nivel btn btn-sm border-0"
                    style={obtenerEstiloNivel(atleta.nivel)}
                  >
                    {atleta.nivel}
                  </button>
                </td>
                <td className="edad-ne">
                  <div className="d-flex align-items-center gap-2">
                    <div className="barra-ren progress flex-grow-1" style={{ height: "10px" }}>
                      <div
                        className="barra-fill progress-bar"
                        role="progressbar"
                        style={{ width: `${atleta.rendimiento}%` }}
                        aria-valuenow={atleta.rendimiento}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span>{atleta.rendimiento}%</span>
                  </div>
                </td>

                <td>
                  <div id="con-acci" className="d-flex gap-1">
                    <button
                        type="button"
                        className="btn-ojo btn-sm btn-light"
                        onClick={() => onVerAtleta(atleta)}
                        >
                          <i className="svg-ojo bi bi-eye"></i>
                        </button>
                    <button
                      type="button"
                      className="btn-lapiz btn-sm btn-light"
                      onClick={() => onEditarAtleta(atleta)}
                    >
                      <i className="svg-dee bi bi-pencil"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-archivo btn-sm btn-light"
                      onClick={() => onRegistrarAtleta(atleta)}
                    >
                      <i className="svg-deee bi bi-folder-fill"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-basura btn-sm btn-light"
                      onClick={() => onEliminarAtleta(atleta)}
                    >
                      <i className="svg-de bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-muted">
                No se encontraron atletas que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TablaAtletas;