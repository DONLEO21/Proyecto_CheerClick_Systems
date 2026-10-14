import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_ITEMS } from "./dashboardAdminData.js";

export default function TablaSolicitudes({ pendientes, cargando, error, onVer, onVerTodas }) {
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0); // paginador de solicitudes (base 0)

  // Pendientes filtradas por el buscador (busca en TODAS, no solo en las visibles)
  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return pendientes;
    return pendientes.filter((c) =>
      [c.codigo, c.nombre, c.email, c.rol].some((campo) =>
        (campo ?? "").toLowerCase().includes(termino),
      ),
    );
  }, [pendientes, busqueda]);

  // Paginación: máximo MAX_ITEMS filas por página
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / MAX_ITEMS));
  const paginaActual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaActual * MAX_ITEMS;
  const visibles = filtradas.slice(inicio, inicio + MAX_ITEMS);

  const hayDatos = !cargando && !error;

  return (
    <article className="tarjeta-dashboard tarjeta-dashboard--ancha">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--espacio">
        <div className="titulo-con-contador">
          <h2>Solicitudes de cuentas pendientes</h2>
          {hayDatos && pendientes.length > 0 && (
            <span
              className="contador-pendientes"
              aria-label={`${pendientes.length} solicitudes pendientes`}
            >
              {pendientes.length}
            </span>
          )}
        </div>

        <label className="buscador" aria-label="buscar solicitudes">
          <Search size={18} strokeWidth={2} />
          <input
            type="search"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(0);
            }}
          />
        </label>
      </header>

      <div className="tarjeta-dashboard__contenido">
        <div className="tabla-dashboard__scroll">
          <table className="tabla-dashboard">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Fecha registro</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {visibles.map((c) => (
                <tr key={c.id}>
                  <td>{c.codigo}</td>
                  <td>{c.nombre}</td>
                  <td>
                    <span className={`badge badge--${c.rol === "entrenador" ? "amarillo" : "azul"}`}>
                      {c.rol === "entrenador" ? "Entrenador" : "Atleta"}
                    </span>
                  </td>
                  <td>{c.email}</td>
                  <td>{new Date(c.created_at).toLocaleDateString("es-CO")}</td>
                  <td>
                    <button type="button" className="btn-tabla btn-tabla--ver" onClick={() => onVer(c.id)}>
                      <Search size={18} strokeWidth={2} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {cargando && (
                <tr>
                  <td colSpan={6} className="tabla-dashboard__vacio">Cargando solicitudes...</td>
                </tr>
              )}

              {!cargando && error && (
                <tr>
                  <td colSpan={6} className="tabla-dashboard__vacio">
                    No se pudieron cargar las solicitudes: {error}
                  </td>
                </tr>
              )}

              {hayDatos && filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="tabla-dashboard__vacio">
                    {busqueda.trim()
                      ? "Ninguna solicitud coincide con tu búsqueda."
                      : "No hay solicitudes pendientes."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pie: solo aparece si hay más de MAX_ITEMS solicitudes */}
      {hayDatos && filtradas.length > MAX_ITEMS && (
        <footer className="pie-tabla">
          <span>
            Mostrando {inicio + 1}–{inicio + visibles.length} de {filtradas.length}
          </span>

          <div className="pie-tabla__acciones">
            <button type="button" className="enlace-ver-todas" onClick={onVerTodas}>
              Ver todas en Cuentas
            </button>

            <div className="paginador" role="group" aria-label="paginación de solicitudes">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={paginaActual === 0}
                onClick={() => setPagina(paginaActual - 1)}
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
              <span className="paginador__indicador">
                {paginaActual + 1} / {totalPaginas}
              </span>
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => setPagina(paginaActual + 1)}
              >
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}