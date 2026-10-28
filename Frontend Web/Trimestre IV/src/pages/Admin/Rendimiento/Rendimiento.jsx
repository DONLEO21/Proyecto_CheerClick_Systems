import "./Rendimiento.css";
import Filtros from "./Filtros";
import { targetasEstado } from "../../../data/targetasEstado";
import TargetaEstado from "./TargetaEstado";
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import TablaAtletas from "./TablaAtletas";
import Paginacion from "./Paginacion";
import ConsultarRendimiento from "./ConsultarRendimiento";
import EditarRendimiento from "./EditarRendimiento";
import RegistrarRendimiento from "./RegistrarRendimiento";
import GestionDeHabilidades from "./GestionDeHabilidades"; 
import TituloRen from "./TituloRen";

const TOTAL_HABILIDADES = 54; // 54 habilidades completadas = 100% de rendimiento
const PROGRESO_URL = "http://localhost:3001/progresoHabilidades";

function Rendimiento() {
  const [atletas, setAtletas] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");

  const itemsPorPagina = 6; 

  const cargarDatos = () => {
    Promise.all([
      fetch("http://localhost:3001/atletas").then((r) => r.json()),
      // Traemos todo el progreso sin filtrar por query param, así evitamos
      // depender de la sintaxis de filtros de la versión de json-server instalada.
      fetch(PROGRESO_URL).then((r) => r.json()),
    ])
      .then(([datosAtletas, datosProgreso]) => {
        setAtletas(Array.isArray(datosAtletas) ? datosAtletas : []);
        setProgreso(Array.isArray(datosProgreso) ? datosProgreso : []);
      })
      .catch((error) => {
        console.error("Error al cargar atletas/rendimiento", error);
        setAtletas([]);
        setProgreso([]);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ── Rendimiento calculado dinámicamente a partir de progresoHabilidades ──
  const atletasConRendimiento = useMemo(() => {
    return atletas.map((atleta) => {
      const completadas = progreso.filter(
        (p) => p.atletaId === atleta.id && p.completado
      ).length;
      const rendimiento = Math.round((completadas / TOTAL_HABILIDADES) * 100);
      return { ...atleta, rendimiento };
    });
  }, [atletas, progreso]);

  const handleBusquedaChange = (texto) => {
    setBusqueda(texto);
    setPaginaActual(1); 
  };

  const handleNivelChange = (nivel) => {
    setNivelSeleccionado(nivel);
    setPaginaActual(1);
  };

  const usuariosFiltrados = atletasConRendimiento.filter((atleta) => {
    const coincideNombre = atleta.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase().trim());

    const coincideNivel =
      nivelSeleccionado === "" ||
      atleta.nivel?.toLowerCase().trim() === nivelSeleccionado.toLowerCase().trim();

    return coincideNombre && coincideNivel;
  });

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina; 
  const atletasPaginados = usuariosFiltrados.slice(inicio, fin);

  {/* VISTAS DE ACUERDO CON DONDE SE DE CLICK */}
  const [vista, setVista] = useState("tabla"); 
  const [atletaSeleccionado, setAtletaSeleccionado] = useState(null);

  const handleVerAtleta = (atleta) => {
    setAtletaSeleccionado(atleta);
    setVista("consultar");
  };

  const handleVolver = () => {
    setAtletaSeleccionado(null);
    setVista("tabla");
    cargarDatos(); // refresca por si el rendimiento cambió en otra vista
  };

  const handleEditarAtleta = (atleta) => {
    setAtletaSeleccionado(atleta);
    setVista("editar");
  };

  const handleRegistrarAtleta = (atleta) => {
    setAtletaSeleccionado(atleta);
    setVista("registrar");
  };

  const handleGestionarHabilidades = (atleta) => {
    setAtletaSeleccionado(atleta);
    setVista("habilidades");
  };

  // ── Botón de papelera: resetea el rendimiento del atleta a 0% ──
  const handleEliminarRendimiento = (atleta) => {
    Swal.fire({
      title: "¿Reiniciar rendimiento?",
      html: `El rendimiento de <strong>${atleta.nombre}</strong> quedará en <strong>0%</strong> (se desmarcarán todas sus habilidades completadas).<br><small style="color:#8c8c8c">Esta acción no se puede deshacer.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a15252",
      cancelButtonColor: "#335eb6",
      confirmButtonText: "Sí, reiniciar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-danger mx-1",
        cancelButton: "btn btn-secondary mx-1",
      },
    }).then((resultado) => {
      if (!resultado.isConfirmed) return;

      const entradasDelAtleta = progreso.filter((p) => p.atletaId === atleta.id);

      Promise.all(
        entradasDelAtleta.map((entrada) =>
          fetch(`${PROGRESO_URL}/${entrada.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completado: false }),
          })
        )
      )
        .then(() => {
          // Actualiza el estado local sin necesidad de recargar todo desde el servidor
          setProgreso((prev) =>
            prev.map((p) =>
              p.atletaId === atleta.id ? { ...p, completado: false } : p
            )
          );
          Swal.fire({
            title: "Rendimiento reiniciado",
            text: `${atleta.nombre} quedó en 0%.`,
            icon: "success",
            confirmButtonColor: "#59a050",
            buttonsStyling: false,
            customClass: { confirmButton: "btn btn-success mx-1" },
            timer: 1800,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "No se pudo reiniciar el rendimiento.",
            icon: "error",
            confirmButtonColor: "#cc0000",
            buttonsStyling: false,
            customClass: { confirmButton: "btn btn-danger mx-1" },
          });
        });
    });
  };

  return (
    <div className="conteni">

      {vista === "tabla" ? (
        <>

        <TituloRen/>
          <section id="targetasEstado">
            <div className="container">
              <div className="row mt-3">
                {targetasEstado.map((item) => (
                  <div className="col-lg-4" key={item.id}>
                    <TargetaEstado {...item} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Filtros 
            busqueda={busqueda} 
            setBusqueda={handleBusquedaChange} 
            nivelSeleccionado={nivelSeleccionado}
            setNivelSeleccionado={handleNivelChange}
            onGestionarHabilidades={handleGestionarHabilidades}
          />
          
          <TablaAtletas 
            atletas={atletasPaginados} 
            onVerAtleta={handleVerAtleta} 
            onEditarAtleta={handleEditarAtleta}
            onRegistrarAtleta={handleRegistrarAtleta}
            onGestionarHabilidades={handleGestionarHabilidades}
            onEliminarAtleta={handleEliminarRendimiento}
          />

          <Paginacion
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            totalItems={usuariosFiltrados.length}
            itemsPorPagina={itemsPorPagina}
          />
        </>
      ) : vista === "consultar" ? (
        <ConsultarRendimiento 
          atleta={atletaSeleccionado} onVolver={handleVolver} 
        />
      ) : vista === "editar" ? (
        <EditarRendimiento 
          atleta={atletaSeleccionado} onVolver={handleVolver} 
        />
      ) : vista === "registrar" ? (
        <RegistrarRendimiento atleta={atletaSeleccionado} onVolver={handleVolver} />
      ) : vista === "habilidades" ? (
        <GestionDeHabilidades atleta={atletaSeleccionado} onVolver={handleVolver} />
      ) : null}
    </div>
  );
}

export default Rendimiento;