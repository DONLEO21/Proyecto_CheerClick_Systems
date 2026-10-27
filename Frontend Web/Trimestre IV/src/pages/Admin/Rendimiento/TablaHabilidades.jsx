import {
  obtenerClaseNivelHabilidad,
  obtenerClaseTipoHabilidad,
  etiquetaTipoHabilidad,
} from "../../../components/utils/nivelEstilosHabilidad";

function TablaHabilidades({
  habilidades,
  onEditar,
  onEliminar,
  onCambiarEstado,
}) {
  return (
    <section id="panel-h" className="container">
      <table id="tabla-h" className="table align-middle">
        <thead>
          <tr>
            <td>ID</td>
            <td>Habilidad</td>
            <td>Nivel</td>
            <td>Tipo</td>
            <td>Estado</td>
            <td>Acciones</td>
          </tr>
        </thead>
        <tbody>
          {habilidades.length > 0 ? (
            habilidades.map((h) => (
              <tr key={h.id}>
                <td>
                  <span>{h.id}</span>
                </td>

                <td className="edad-ne">{h.texto}</td>

                <td>
                  <button className={obtenerClaseNivelHabilidad(h.nivel)}>
                    {h.nivel}
                  </button>
                </td>

                <td>
                  <button className={obtenerClaseTipoHabilidad(h.categoria)}>
                    {etiquetaTipoHabilidad(h.categoria)}
                  </button>
                </td>

                <td>
                  {h.estado === "inhabilitada" ? (
                    <button
                      id="btn-desa"
                      onClick={() => onCambiarEstado(h)}
                      title="Click para activar"
                    >
                      <svg
                        id="sim-desa"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M4.929 4.929 19.07 19.071" />
                      </svg>{" "}
                      Inhabilitada
                    </button>
                  ) : (
                    <button
                      id="btn-activ"
                      onClick={() => onCambiarEstado(h)}
                      title="Click para inhabilitar"
                    >
                      <svg
                        id="sim-acti"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>{" "}
                      Activa
                    </button>
                  )}
                </td>

                <td>
                  <div id="con-acci">
                    <button className="btn-lapiz" onClick={() => onEditar(h)}>
                      <i class="svg-de bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn-basura"
                      onClick={() => onEliminar(h)}
                    >
                      <i class="svg-de bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No se encontraron habilidades que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TablaHabilidades;