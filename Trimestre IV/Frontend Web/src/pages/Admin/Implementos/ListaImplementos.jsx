import { useEffect, useMemo, useRef, useState } from "react";
import { getImplementos } from "../../../services/ImplementosService";
import ImplementoRow from "./ImplementoRow";
import ModalAgregar from "./ModalAgregar";
import ModalEditar from "./ModalEditar";
import ModalConfirmarEstado from "./ModalConfirmarEstado";

export default function ListaImplementos() {
  const [implementos, setImplementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCantidad, setFiltroCantidad] = useState("todos");

  const [implementoSeleccionado, setImplementoSeleccionado] = useState(null);
  const [accionEstado, setAccionEstado] = useState("inhabilitar");

  const modalAgregarRef = useRef(null);
  const modalEditarRef = useRef(null);
  const modalEstadoRef = useRef(null);

  const cargarImplementos = async () => {
    setCargando(true);
    setError("");
    try {
      setImplementos(await getImplementos());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarImplementos();
  }, []);

  const implementosFiltrados = useMemo(() => {
    return implementos.filter((item) => {
      const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === "todos" || item.tipo.toLowerCase() === filtroTipo;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "disponible" && item.estado === "Disponible") ||
        (filtroEstado === "nodisponible" && item.estado === "No Disponible");
      const coincideCantidad =
        filtroCantidad === "todos" ||
        (filtroCantidad === "0-10" && item.cantidad <= 10) ||
        (filtroCantidad === "11-25" && item.cantidad > 10 && item.cantidad <= 25) ||
        (filtroCantidad === "+25" && item.cantidad > 25);
      return coincideBusqueda && coincideTipo && coincideEstado && coincideCantidad;
    });
  }, [implementos, busqueda, filtroTipo, filtroEstado]);

  const abrirAgregar = () => modalAgregarRef.current.showModal();

  const abrirEditar = (implemento) => {
    setImplementoSeleccionado(implemento);
    modalEditarRef.current.showModal();
  };

  const pedirCambioEstado = (implemento) => {
    setImplementoSeleccionado(implemento);
    setAccionEstado(implemento.estado === "Disponible" ? "inhabilitar" : "habilitar");
    modalEstadoRef.current.showModal();
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar Implemento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button type="button" className="btn btn-danger ms-md-auto" onClick={abrirAgregar}>
          + Agregar nuevo Implemento
        </button>

        <div className="filtro-caja">
          <span>Tipo:</span>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} >
            <option value="todos">Todos</option>
            <option value="ropa">Ropa</option>
            <option value="accesorios">Accesorios</option>
            <option value="calzado">Calzado</option>
          </select>
        </div>

        <div className="filtro-caja">
          <span>Estado:</span>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="nodisponible">No Disponible</option>
          </select>
        </div>

        <div className="filtro-caja">
          <span>Cantidad:</span>
          <select value={filtroEstado} onChange={(e) => setFiltroCantidad(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="0-10">0-10</option>
            <option value="11-25">11-25</option>
            <option value="+25">+25</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle tabla-implementos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre del Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr><td colSpan={7} className="text-center text-muted py-4">Cargando implementos...</td></tr>
            )}
            {!cargando && implementosFiltrados.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted py-4">No se encontraron implementos.</td></tr>
            )}
            {!cargando &&
              implementosFiltrados.map((item) => (
                <ImplementoRow
                  key={item.id}
                  implemento={item}
                  onEditar={abrirEditar}
                  onPedirCambioEstado={pedirCambioEstado}
                />
              ))}
          </tbody>
        </table>
      </div>

      <ModalAgregar ref={modalAgregarRef} onGuardado={cargarImplementos} />
      <ModalEditar ref={modalEditarRef} implemento={implementoSeleccionado} onGuardado={cargarImplementos} />
      <ModalConfirmarEstado
        ref={modalEstadoRef}
        implemento={implementoSeleccionado}
        accion={accionEstado}
        onConfirmado={cargarImplementos}
      />
    </>
  );
}