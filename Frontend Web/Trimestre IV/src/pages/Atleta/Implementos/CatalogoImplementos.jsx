import { useEffect, useMemo, useRef, useState } from "react";
// Corregido: sube 3 niveles hasta src (src/services/...)
import { getImplementos } from "../../../services/ImplementosService";
import { getResenas } from "../../../services/ResenaService";
import ProductoCard from "./ProductoCard";
import ModalSolicitarPedido from "./ModalSolicitarPedido";

// Subcomponente reutilizable para el Select personalizado
function FiltroSelectCustom({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

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

export default function CatalogoImplementos({ onAviso }) {
  const [implementos, setImplementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const modalRef = useRef(null);

  const [resenas, setResenas] = useState([]);
  useEffect(() => {
    getResenas()
      .then(setResenas)
      .catch(() => setResenas([]));
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await getImplementos();
      setImplementos(datos.filter((i) => i.estado === "Disponible"));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const productosFiltrados = useMemo(() => {
    return implementos.filter((item) => {
      const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideGenero = filtroGenero === "todos" || item.genero?.toLowerCase() === filtroGenero;
      const coincideTipo = filtroTipo === "todos" || item.tipo?.toLowerCase() === filtroTipo;
      return coincideBusqueda && coincideGenero && coincideTipo;
    });
  }, [implementos, busqueda, filtroGenero, filtroTipo]);

  const abrirSolicitud = (producto) => {
    setProductoSeleccionado(producto);
    modalRef.current.showModal();
  };

  return (
    <section aria-label="Catálogo de implementos deportivos">
      <div className="barra-filtros-modulo">
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

        <div className="filtro-selectores">
          {/* Filtro de Género */}
          <FiltroSelectCustom
            label="Género"
            value={filtroGenero}
            onChange={setFiltroGenero}
            options={[
              { value: "todos", label: "Todos" },
              { value: "femenino", label: "Femenino" },
              { value: "masculino", label: "Masculino" },
              { value: "unisex", label: "Unisex" },
            ]}
          />

          {/* Filtro de Categoría */}
          <FiltroSelectCustom
            label="Categoría"
            value={filtroTipo}
            onChange={setFiltroTipo}
            options={[
              { value: "todos", label: "Todos" },
              { value: "ropa", label: "Ropa" },
              { value: "calzado", label: "Calzado" },
              { value: "accesorios", label: "Accesorios" },
            ]}
          />
        </div>
      </div>

      {error && <div className="alerta-error">{error}</div>}

      <h2 className="subtitulo-seccion">Catálogo de Productos</h2>

      <div className="grid-productos">
        {cargando && <p>Cargando catálogo...</p>}
        {!cargando && productosFiltrados.length === 0 && <p>No se encontraron productos.</p>}
        {!cargando &&
          productosFiltrados.map((item) => (
            <ProductoCard key={item.id} implemento={item} onSolicitar={abrirSolicitud} />
          ))}
      </div>

      <ModalSolicitarPedido
        ref={modalRef}
        implemento={productoSeleccionado}
        onEnviado={() => {
          cargar();
          onAviso("Solicitud enviada correctamente.");
        }}
      />

      <div className="seccion-comentarios-comunidad">
        <h2 className="subtitulo-seccion">Opiniones de la Comunidad</h2>
        <div className="contenedor-comentarios">
          {resenas.length === 0 && <p>Aún no hay opiniones de la comunidad.</p>}
          {resenas.map((r) => (
            <div className="bloque-comentario" key={r.id}>
              <div className="comentario-meta">
                <span className="nombre-usuario">{r.atleta}</span>
                <div className="estrellas-opinion" aria-label={`${r.calificacion} estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < r.calificacion ? "estrella-llena" : "estrella-vacia"}>★</span>
                  ))}
                </div>
              </div>
              <p className="comentario-texto">{r.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}