import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import TargetasEstadoHabilidad from "./TargetasEstadoHabilidad";
import FiltrosHabilidades from "./FiltrosHabilidades";
import TablaHabilidades from "./TablaHabilidades";
import Paginacion from "./Paginacion";
import ModalHabilidad from "./ModalHabilidad";
import "./GestionHabilidades.css";
import "../../../App.css";



const API_URL = "http://localhost:3001/habilidades";

function GestionDeHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [habilidadSeleccionada, setHabilidadSeleccionada] = useState(null);

  const itemsPorPagina = 6;

  // ── Cargar habilidades ──────────────────────────────
  const cargarHabilidades = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((datos) => setHabilidades(Array.isArray(datos) ? datos : []))
      .catch((error) => {
        console.error("Error al cargar habilidades", error);
        setHabilidades([]);
      });
  };

  useEffect(() => {
    cargarHabilidades();
  }, []);

  // ── Filtros ──────────────────────────────────────────
  const handleBusquedaChange = (texto) => {
    setBusqueda(texto);
    setPaginaActual(1);
  };

  const handleNivelChange = (nivel) => {
    setNivelSeleccionado(nivel);
    setPaginaActual(1);
  };

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
    setPaginaActual(1);
  };

  const habilidadesFiltradas = habilidades.filter((h) => {
    const coincideTexto = h.texto
      ?.toLowerCase()
      .includes(busqueda.toLowerCase().trim());

    const coincideNivel =
      nivelSeleccionado === "" ||
      h.nivel?.toLowerCase().trim() === nivelSeleccionado.toLowerCase().trim();

    const coincideTipo =
      tipoSeleccionado === ""
        ? true
        : tipoSeleccionado === "inhabilitada"
        ? h.estado === "inhabilitada"
        : h.categoria === tipoSeleccionado && h.estado !== "inhabilitada";

    return coincideTexto && coincideNivel && coincideTipo;
  });

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const habilidadesPaginadas = habilidadesFiltradas.slice(inicio, fin);

  const abrirModalNueva = () => {
    setHabilidadSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (habilidad) => {
    setHabilidadSeleccionada(habilidad);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setHabilidadSeleccionada(null);
  };

  const guardarHabilidad = (form) => {
    const esEdicion = Boolean(form.id);

    const peticion = esEdicion
      ? fetch(`${API_URL}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, estado: form.estado || "activa" }),
        })
      : fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, estado: "activa" }),
        });

    peticion
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo guardar la habilidad");
        return res.json();
      })
      .then(() => {
        cargarHabilidades();
        cerrarModal();
      })
      .catch((error) => console.error(error));
  };

  const eliminarHabilidad = (habilidad) => {
  Swal.fire({
    title: "¿Eliminar Habilidad?",
    html: `¿Está seguro/a de que desea eliminar la habilidad <strong>"${habilidad.texto}"</strong>?<br><small style="color:#8c8c8c">Esta acción no se puede deshacer.</small>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#a15252",
    cancelButtonColor: "#335eb6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      popup: "swal-atl-popup",
      confirmButton: "swal-atl-confirmar",
      cancelButton: "swal-atl-cancelar",
      title: "swal-atl-titulo",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (!result.isConfirmed) return;

    fetch(`${API_URL}/${habilidad.id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar la habilidad");
        cargarHabilidades();
        Swal.fire({
          title: "Eliminada",
          text: "La habilidad se eliminó correctamente.",
          icon: "success",
          confirmButtonColor: "#59a050",
          customClass: {
            popup: "swal-atl-popup",
            confirmButton: "swal-atl-confirmar",
            title: "swal-atl-titulo",
          },
          buttonsStyling: false,
          timer: 1800,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la habilidad.",
          icon: "error",
          confirmButtonColor: "#cc0000",
          customClass: { popup: "swal-atl-popup", confirmButton: "swal-atl-confirmar", title: "swal-atl-titulo" },
          buttonsStyling: false,
        });
      });
  });
};

  const cambiarEstadoHabilidad = (habilidad) => {
    const nuevoEstado =
      habilidad.estado === "inhabilitada" ? "activa" : "inhabilitada";

    fetch(`${API_URL}/${habilidad.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cambiar el estado");
        cargarHabilidades();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="contenido">
      <aside id="titu-ren">
        <h3>Gestión de Habilidades</h3>
        <p>Registra, edita e inhabilita habilidades del sistema de evaluación</p>
      </aside>

      <TargetasEstadoHabilidad habilidades={habilidades} />

      <FiltrosHabilidades
        busqueda={busqueda}
        setBusqueda={handleBusquedaChange}
        nivelSeleccionado={nivelSeleccionado}
        setNivelSeleccionado={handleNivelChange}
        tipoSeleccionado={tipoSeleccionado}
        setTipoSeleccionado={handleTipoChange}
        onNuevaHabilidad={abrirModalNueva}
      />

      <TablaHabilidades
        habilidades={habilidadesPaginadas}
        onEditar={abrirModalEditar}
        onEliminar={eliminarHabilidad}
        onCambiarEstado={cambiarEstadoHabilidad}
      />

      <Paginacion
        paginaActual={paginaActual}
        setPaginaActual={setPaginaActual}
        totalItems={habilidadesFiltradas.length}
        itemsPorPagina={itemsPorPagina}
        etiqueta="habilidades"
      />

      {modalAbierto && (
        <ModalHabilidad
          habilidad={habilidadSeleccionada}
          onCerrar={cerrarModal}
          onGuardar={guardarHabilidad}
        />
      )}
    </div>
  );
}

export default GestionDeHabilidades;