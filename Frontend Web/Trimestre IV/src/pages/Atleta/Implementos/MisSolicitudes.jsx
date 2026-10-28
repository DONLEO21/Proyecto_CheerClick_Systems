import { useEffect, useMemo, useRef, useState } from "react";
import { getSolicitudes, marcarRecibido } from "../../../services/SolicitudesService";
import { ATLETA_ACTUAL } from "../../../services/AtletaActual";
import ModalCancelarSolicitud from "./ModalCancelarSolicitud";
import FormularioResena from "./FormularioResena";

const claseEstado = {
  Pendiente: "estado-pendiente",
  Aprobado: "estado-listo",
  Rechazado: "estado-rechazado",
  Cancelado: "estado-cancelado",
};

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

export default function MisSolicitudes({ onAviso }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroFecha, setFiltroFecha] = useState("mas-recientes");

  const [seleccionada, setSeleccionada] = useState(null);
  const modalCancelarRef = useRef(null);

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await getSolicitudes();
      setSolicitudes(datos.filter((s) => s.atleta === ATLETA_ACTUAL.nombre));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    let lista = solicitudes.filter((s) => {
      const coincideBusqueda = s.implementoNombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = filtroEstado === "todos" || s.estado.toLowerCase() === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
    lista = [...lista].sort((a, b) =>
      filtroFecha === "mas-recientes"
        ? new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
        : new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud)
    );
    return lista;
  }, [solicitudes, busqueda, filtroEstado, filtroFecha]);

  const pedirCancelar = (s) => {
    setSeleccionada(s);
    modalCancelarRef.current.showModal();
  };

  const handleMarcarRecibido = async (s) => {
    try {
      await marcarRecibido(s);
      cargar();
      onAviso("Pedido marcado como recibido.");
    } catch (err) {
      onAviso(err.message, "error");
    }
  };

  return (
    <section aria-label="Mis solicitudes de implementos">
      <div className="barra-filtros-modulo">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar Solicitud..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtro-selectores">
          {/* Filtro Estado */}
          <FiltroSelectCustom
            label="Estado"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: "todos", label: "Todos" },
              { value: "pendiente", label: "Pendiente" },
              { value: "aprobado", label: "Aprobado" },
              { value: "rechazado", label: "Rechazado" },
              { value: "cancelado", label: "Cancelado" },
            ]}
          />

          {/* Filtro Fecha */}
          <FiltroSelectCustom
            label="Fecha"
            value={filtroFecha}
            onChange={setFiltroFecha}
            options={[
              { value: "mas-recientes", label: "Actuales" },
              { value: "menos-recientes", label: "Antiguos" },
            ]}
          />
        </div>
      </div>

      {error && <div className="alerta-error">{error}</div>}

      <h2 className="subtitulo-seccion">Mis Productos Solicitados</h2>

      <div className="lista-solicitudes">
        {cargando && <p>Cargando solicitudes...</p>}
        {!cargando && solicitudesFiltradas.length === 0 && <p>No tienes solicitudes registradas.</p>}

        {!cargando &&
          solicitudesFiltradas.map((s) => (
            <article className="tarjeta-solicitud" key={s.id}>
              <div className="solicitud-cuerpo">
                <img
                  src={s.implementoImagen || "/img/placeholder.png"}
                  alt={s.implementoNombre}
                  className="img-solicitud"
                />
                <div className="solicitud-detalles">
                  <h4>{s.implementoNombre}</h4>
                  <p className="cantidad-solicitada">{s.cantidad} unidad(es) · Talla {s.talla}</p>
                  <p className="precio-solicitado">
                    ${(s.precioUnitario * s.cantidad).toLocaleString("es-CO")}
                  </p>
                  <p className="pago-metodo">{s.metodoPago}</p>
                  {s.estado === "Rechazado" && s.motivoRechazo && (
                    <p className="motivo-rechazo">Motivo: {s.motivoRechazo}</p>
                  )}
                </div>
                <div className="solicitud-acciones">
                  <span className={`estado-tag ${claseEstado[s.estado]}`}>
                    {s.estado === "Aprobado" && s.recibido ? "Recibido" : s.estado === "Aprobado" ? "Listo para entregar" : s.estado}
                  </span>
                  {s.estado === "Pendiente" && (
                    <button type="button" className="btn-cancelar-pedido" onClick={() => pedirCancelar(s)}>
                      Cancelar
                    </button>
                  )}
                  {s.estado === "Aprobado" && !s.recibido && (
                    <button type="button" className="label-marcar-recibido" onClick={() => handleMarcarRecibido(s)}>
                      Marcar como recibido
                    </button>
                  )}
                </div>
              </div>

              {s.estado === "Aprobado" && s.recibido && !s.resenaEnviada && (
                <FormularioResena
                  solicitud={s}
                  onEnviada={() => {
                    cargar();
                    onAviso("¡Gracias por tu reseña!");
                  }}
                />
              )}
            </article>
          ))}
      </div>

      <ModalCancelarSolicitud
        ref={modalCancelarRef}
        solicitud={seleccionada}
        onCancelado={() => {
          cargar();
          onAviso("Solicitud cancelada.");
        }}
        onError={(mensaje) => onAviso(mensaje, "error")}
      />
    </section>
  );
}