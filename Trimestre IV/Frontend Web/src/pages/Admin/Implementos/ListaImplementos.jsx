import { useEffect, useMemo, useRef, useState } from "react";
import { getImplementos } from "../../../services/ImplementosService";
import ImplementoRow from "./ImplementoRow";
import ModalAgregar from "./ModalAgregar";
import ModalEditar from "./ModalEditar";
import ModalConfirmarEstado from "./ModalConfirmarEstado";

// Componente reútilizable para el filtro elegante
function FiltroSelectCustom({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="filtro-caja-custom" ref={containerRef}>
      <span className="filtro-label">{label}:</span>
      <div className="custom-dropdown">
        <button
          type="button"
          className="custom-dropdown-btn"
          onClick={() => setOpen(!open)}
        >
          <span>{selectedOption.label}</span>
          <svg
            className={`arrow-icon ${open ? "open" : ""}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul className="custom-dropdown-menu">
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`custom-dropdown-item ${value === opt.value ? "active" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ListaImplementos({ onAviso }) {
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
  }, [implementos, busqueda, filtroTipo, filtroEstado, filtroCantidad]);

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

        <button type="button" className="btn btn-danger btn-agregar ms-md-auto" onClick={abrirAgregar}>
          + Agregar nuevo Implemento
        </button>

        {/* Filtro Tipo */}
        <FiltroSelectCustom
          label="Tipo"
          value={filtroTipo}
          onChange={setFiltroTipo}
          options={[
            { value: "todos", label: "Todos" },
            { value: "ropa", label: "Ropa" },
            { value: "accesorios", label: "Accesorios" },
            { value: "calzado", label: "Calzado" },
          ]}
        />

        {/* Filtro Estado */}
        <FiltroSelectCustom
          label="Estado"
          value={filtroEstado}
          onChange={setFiltroEstado}
          options={[
            { value: "todos", label: "Todos" },
            { value: "disponible", label: "Disponible" },
            { value: "nodisponible", label: "No Disponible" },
          ]}
        />

        {/* Filtro Cantidad (Corregido el estado de filtroCantidad) */}
        <FiltroSelectCustom
          label="Cantidad"
          value={filtroCantidad}
          onChange={setFiltroCantidad}
          options={[
            { value: "todos", label: "Todos" },
            { value: "0-10", label: "0-10" },
            { value: "11-25", label: "11-25" },
            { value: "+25", label: "+25" },
          ]}
        />
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

      <ModalAgregar
        ref={modalAgregarRef}
        onGuardado={() => {
          cargarImplementos();
          onAviso("Implemento creado correctamente.");
        }}
      />
      <ModalEditar
        ref={modalEditarRef}
        implemento={implementoSeleccionado}
        onGuardado={() => {
          cargarImplementos();
          onAviso("Implemento actualizado correctamente.");
        }}
      />
      <ModalConfirmarEstado
        ref={modalEstadoRef}
        implemento={implementoSeleccionado}
        accion={accionEstado}
        onConfirmado={() => {
          cargarImplementos();
          onAviso(accionEstado === "inhabilitar" ? "Implemento inhabilitado." : "Implemento habilitado.");
        }}
        onError={(mensaje) => onAviso(mensaje, "error")}
      />
    </>
  );
}