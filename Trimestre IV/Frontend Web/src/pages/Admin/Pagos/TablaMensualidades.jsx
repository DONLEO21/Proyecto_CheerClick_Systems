import { obtenerEstiloPlan, obtenerEstiloEstadoPago } from "../../../components/utils/EstilosPago";

function TablaMensualidades({ pagos, onRegistrar, onVerComprobante }) {
  return (
    <section id="panel" className="container mt-4">
      <table id="tabla" className="table align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Atleta</th>
            <th>Mes</th>
            <th>Estado</th>
            <th>Plan</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => {
              const estilo = obtenerEstiloEstadoPago(pago.estado);
              return (
                <tr key={pago.id}>
                  <td className="edad-ne">{pago.id}</td>
                  <td>
                    <span className="tex-tabla">{pago.atleta?.nombre ?? "Atleta no encontrado"}</span>
                  </td>
                  <td>{pago.mes}</td>
                  <td>
                    <div
                      className="btn-nivel btn btn-sm border-0"
                      style={{ backgroundColor: estilo.backgroundColor, color: estilo.color }}
                    >
                      {estilo.texto}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-nivel btn btn-sm border-0"
                      style={obtenerEstiloPlan(pago.plan)}
                    >
                      {pago.plan}
                    </button>
                  </td>
                  <td className="edad-ne">
                    {pago.valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </td>
                  <td>
                    <div id="con-acci" className="d-flex gap-1">
                      {pago.registrado ? (
                        <span className="pill-registrado">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          Registrado
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-registrar"
                          onClick={() => onRegistrar(pago)}
                        >
                          Registrar pago
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-ojo btn-sm btn-light"
                        onClick={() => onVerComprobante(pago)}
                      >
                        <i class="svg-ojo bi bi-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                No se encontraron pagos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TablaMensualidades;