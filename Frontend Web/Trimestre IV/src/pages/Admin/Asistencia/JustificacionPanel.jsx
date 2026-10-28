import { useEffect, useMemo, useRef, useState } from "react";
import JustificacionCard from "./JustificacionCard";
import ModalRevisionJustificacion from "./ModalRevisionJustificacion";
import AvisoToast from "../../../components/Compartidos/AvisoToast";
import useAviso from "../../../Hooks/useAviso";
import {
  obtenerJustificaciones,
  actualizarJustificacion,
  contarPorEstado,
} from "../../../services/justificacionesService";
import {
  obtenerAtletasPorNivel,
  marcarAsistenciaComoJustificada,
} from "../../../services/asistenciaService";
import { fechaHoyISO, nombreCortoNivel } from "../../../services/data";

export default function JustificacionesPanel({ niveles = [], onCambio }) {
  const [justificaciones, setJustificaciones] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [accionActiva, setAccionActiva] = useState(null); // { justificacion, tipo: 'aprobar' | 'rechazar' }
  const [aviso, mostrarAviso] = useAviso();

  const modalRef = useRef(null);
  const nivelIds = niveles.map((n) => String(n.id));

  const cargarDatos = () => {
    setCargando(true);
    setError("");
    Promise.all([
      obtenerJustificaciones(),
      Promise.all(niveles.map((n) => obtenerAtletasPorNivel(n.id))),
    ])
      .then(([justs, listasAtletas]) => {
        setJustificaciones(justs.filter((j) => nivelIds.includes(String(j.nivelId))));
        setAtletas(listasAtletas.flat());
      })
      .catch(() => setError("No se pudo conectar con el servidor de datos."))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (niveles.length === 0) {
      setCargando(false);
      return;
    }
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niveles.map((n) => n.id).join(",")]);

  const atletaPorId = useMemo(() => {
    const mapa = new Map();
    atletas.forEach((a) => mapa.set(String(a.id), a));
    return mapa;
  }, [atletas]);

  const nivelPorId = useMemo(() => {
    const mapa = new Map();
    niveles.forEach((n) => mapa.set(String(n.id), n));
    return mapa;
  }, [niveles]);

  // Justificaciones del nivel seleccionado (o todas si está en "todos")
  const justificacionesDelNivel = useMemo(() => {
    return filtroNivel === "todos"
      ? justificaciones
      : justificaciones.filter((j) => String(j.nivelId) === filtroNivel);
  }, [justificaciones, filtroNivel]);

  const conteos = useMemo(
    () => contarPorEstado(justificacionesDelNivel),
    [justificacionesDelNivel]
  );

  const conteoGlobal = useMemo(
    () => contarPorEstado(justificaciones),
    [justificaciones]
  );

  const filtradas = useMemo(() => {
    return justificacionesDelNivel
      .filter((j) => (filtroEstado === "todas" ? true : j.estado === filtroEstado))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [justificacionesDelNivel, filtroEstado]);

  const abrirAccion = (justificacion, tipo) => {
    setAccionActiva({ justificacion, tipo });
    modalRef.current?.showModal();
  };

  const confirmarAccion = async (observacion) => {
    if (!accionActiva) return;
    const { justificacion, tipo } = accionActiva;
    const nuevoEstado = tipo === "aprobar" ? "aprobada" : "rechazada";
    try {
      await actualizarJustificacion(justificacion.id, {
        estado: nuevoEstado,
        observacion,
        fechaRevision: fechaHoyISO(),
      });
      if (tipo === "aprobar") {
        await marcarAsistenciaComoJustificada(
          justificacion.nivelId,
          justificacion.fecha,
          justificacion.atletaId,
          justificacion.motivo
        );
      }
      cargarDatos();
      onCambio?.();
      mostrarAviso(
        tipo === "aprobar"
          ? "Justificación aprobada y asistencia justificada."
          : "Justificación rechazada.",
        "ok"
      );
    } catch {
      mostrarAviso("No se pudo actualizar la justificación. Intenta de nuevo.", "error");
    } finally {
      setAccionActiva(null);
    }
  };

  const subtitulo =
    niveles.length > 1
      ? "Revisa, aprueba o rechaza las justificaciones enviadas por los atletas de tus niveles."
      : "Revisa, aprueba o rechaza las justificaciones enviadas por los atletas de tu nivel.";

  return (
    <div>
      <div className="asist-header">
        <div className="asist-header__titulo-bloque">
          <h1>Justificaciones</h1>
          <p>{subtitulo}</p>
        </div>

        <div className="asist-header__tabs-bloque">
          <div className="tabla-contenido">
            {niveles.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`tab-btn${filtroNivel === String(n.id) ? " tab-btn-activo" : ""}`}
                onClick={() => setFiltroNivel(String(n.id))}
                title={`Ver solo justificaciones de ${nombreCortoNivel(n.categoria)}`}
              >
                {n.categoria}
              </button>
            ))}
            <button
              type="button"
              className={`tab-btn tab-btn-justificaciones${filtroNivel === "todos" ? " tab-btn-activo" : ""}`}
              onClick={() => setFiltroNivel("todos")}
            >
              Justificaciones {conteos.pendientes > 0 && <span className="tab-badge">{conteos.pendientes}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="panel-categoria">
        {error && (
          <p className="asist-error" style={{ padding: "16px 20px 0" }}>{error}</p>
        )}

        <div className="just-filtros">
          <div className="just-filtros-estado">
            <button
              type="button"
              className={`just-filtro-pill just-filtro-pendiente${filtroEstado === "pendiente" ? " activo" : ""}`}
              onClick={() => setFiltroEstado("pendiente")}
            >
              <span />Pendientes <span className="just-filtro-num">{conteos.pendientes}</span>
            </button>
            <button
              type="button"
              className={`just-filtro-pill just-filtro-aprobada${filtroEstado === "aprobada" ? " activo" : ""}`}
              onClick={() => setFiltroEstado("aprobada")}
            >
              <span /> Aprobadas <span className="just-filtro-num">{conteos.aprobadas}</span>
            </button>
            <button
              type="button"
              className={`just-filtro-pill just-filtro-rechazada${filtroEstado === "rechazada" ? " activo" : ""}`}
              onClick={() => setFiltroEstado("rechazada")}
            >
              <span className="just-filtro-dot" /> Rechazadas <span className="just-filtro-num">{conteos.rechazadas}</span>
            </button>
            <button
              type="button"
              className={`just-filtro-pill${filtroEstado === "todas" ? " activo" : ""}`}
              onClick={() => setFiltroEstado("todas")}
            >
              Todas <span className="just-filtro-num">{justificacionesDelNivel.length}</span>
            </button>
          </div>
        </div>

        <div className="just-grid-wrapper">
          {cargando ? (
            <p className="asist-cargando">Cargando justificaciones…</p>
          ) : filtradas.length === 0 ? (
            <p className="asist-cargando">No hay justificaciones que coincidan con este filtro.</p>
          ) : (
            <div className="just-grid">
              {filtradas.map((j) => (
                <JustificacionCard
                  key={j.id}
                  justificacion={j}
                  atleta={atletaPorId.get(String(j.atletaId))}
                  nivel={nivelPorId.get(String(j.nivelId))}
                  onAprobar={() => abrirAccion(j, "aprobar")}
                  onRechazar={() => abrirAccion(j, "rechazar")}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalRevisionJustificacion
        ref={modalRef}
        accion={accionActiva?.tipo}
        justificacion={accionActiva?.justificacion}
        atleta={accionActiva ? atletaPorId.get(String(accionActiva.justificacion.atletaId)) : null}
        nivel={accionActiva ? nivelPorId.get(String(accionActiva.justificacion.nivelId)) : null}
        onConfirmar={confirmarAccion}
      />

      <AvisoToast aviso={aviso} />
    </div>
  );
}