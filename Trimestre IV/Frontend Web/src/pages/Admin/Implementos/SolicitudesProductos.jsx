import { useEffect, useMemo, useRef, useState } from "react";
import { getSolicitudes, aprobarSolicitud } from "../../../services/SolicitudesService";
import ModalVerSolicitud from "./ModalVerSolicitud";
import ModalRechazarSolicitud from "./ModalRechazarSolicitud";

const badgePorEstado = {
  Pendiente: "badge-amarilla",
  Aprobado: "badge-verde",
  Rechazado: "badge-roja",
  Cancelado: "badge-roja"
};

export default function SolicitudesProductos() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [seleccionada, setSeleccionada] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");

  const modalVerRef = useRef(null);
  const modalRechazarRef = useRef(null);

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      setSolicitudes(await getSolicitudes());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const verDetalle = (s) => {
    setSeleccionada(s);
    modalVerRef.current.showModal();
  };

  const pedirRechazo = (s) => {
    setSeleccionada(s);
    modalRechazarRef.current.showModal();
  };

  const aprobar = async (s) => {
    try {
      await aprobarSolicitud(s);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const dentroDelRangoFecha = (fechaStr) => {
    if (filtroFecha === "Todos") return true;
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const dias = (ahora - fecha) / (1000 * 60 * 60 * 24);
    if (filtroFecha === "Hoy") return fecha.toDateString() === ahora.toDateString();
    if (filtroFecha === "Esta semana") return dias >= 0 && dias <= 7;
    if (filtroFecha === "Este mes")
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    return true;
  };

  const solicitudesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return solicitudes.filter((s) => {
      const coincideTexto =
        !texto ||
        s.id?.toLowerCase().includes(texto) ||
        s.implementoNombre?.toLowerCase().includes(texto) ||
        s.atleta?.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === "Todos" || s.estado === filtroEstado;
      const coincideFecha = dentroDelRangoFecha(s.fechaSolicitud);
      return coincideTexto && coincideEstado && coincideFecha;
    });
  }, [solicitudes, busqueda, filtroEstado, filtroFecha]);

  return (
    <>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3 acciones-barra">
        <div className="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
          <input
            type="text"
            placeholder="Buscar Solicitud..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtro-caja">
          <span>Estado:</span>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div className="filtro-caja">
          <span>Fecha:</span>
          <select value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Hoy">Hoy</option>
            <option value="Esta semana">Esta semana</option>
            <option value="Este mes">Este mes</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle tabla-implementos">
          <thead>
            <tr>
              <th>Codigo de solicitud</th>
              <th>Producto</th>
              <th>Atleta</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr><td colSpan={7} className="text-center text-muted py-4">Cargando solicitudes...</td></tr>
            )}
            {!cargando && solicitudesFiltradas.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted py-4">No hay solicitudes.</td></tr>
            )}
            {!cargando &&
              solicitudesFiltradas.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={s.implementoImagen || "/img/placeholder.png"}
                        alt={s.implementoNombre}
                        className="img-producto"
                      />
                      <span className="fw-semibold">{s.implementoNombre}</span>
                    </div>
                  </td>
                  <td>{s.atleta}</td>
                  <td>{s.cantidad}</td>
                  <td>{new Date(s.fechaSolicitud).toLocaleDateString("es-CO")}</td>
                  <td>
                    <span className={`badge-pastilla ${badgePorEstado[s.estado]}`}>{s.estado}</span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn-accion-cuadrado btn-accion--ojo"
                        title="Ver detalle"
                        onClick={() => verDetalle(s)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      {s.estado === "Pendiente" && (
                        <>
                          <button
                            type="button"
                            className="btn-accion-cuadrado btn-accion--check"
                            title="Aprobar"
                            onClick={() => aprobar(s)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="btn-accion-cuadrado btn-accion--x"
                            title="Rechazar"
                            onClick={() => pedirRechazo(s)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ModalVerSolicitud ref={modalVerRef} solicitud={seleccionada} />
      <ModalRechazarSolicitud ref={modalRechazarRef} solicitud={seleccionada} onRechazado={cargar} />
    </>
  );
}