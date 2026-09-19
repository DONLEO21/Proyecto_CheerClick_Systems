import { useEffect, useMemo, useRef, useState } from "react";
import { getImplementos } from "../../../services/ImplementosService";
import { getResenas } from "../../../services/ResenaService";
import ProductoCard from "./ProductoCard";
import ModalSolicitarPedido from "./ModalSolicitarPedido";

export default function CatalogoImplementos() {
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
        <div className="filtro-buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            type="text"
            placeholder="Buscar producto…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtro-selectores">
          <div className="grupo-filtro-item">
            <label htmlFor="filtro-genero">Género:</label>
            <select id="filtro-genero" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="grupo-filtro-item">
            <label htmlFor="filtro-tipo">Categoría:</label>
            <select id="filtro-tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="ropa">Ropa</option>
              <option value="calzado">Calzado</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
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

      <ModalSolicitarPedido ref={modalRef} implemento={productoSeleccionado} onEnviado={cargar} />

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