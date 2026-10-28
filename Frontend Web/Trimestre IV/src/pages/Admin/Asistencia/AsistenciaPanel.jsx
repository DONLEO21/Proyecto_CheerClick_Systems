import { useEffect, useMemo, useRef, useState } from "react";
import FilaAtleta from "./FilaAtleta";
import ResumenCards from "./ResumenCards";
import ModalGuardado from "./ModalGuardado";
import ModalConsultar from "./ModalConsultar";
import AvisoToast from "../../../components/Compartidos/AvisoToast";
import useAviso from "../../../Hooks/useAviso";
import {
  obtenerAtletasPorNivel,
  obtenerRegistrosDia,
  guardarAsistenciaDia,
} from "../../../services/asistenciaService";
import { fechaHoyISO, formatearFechaCorta, formatearFechaLarga } from "../../../services/data";
import "./Asistencia.css";

export default function AsistenciaPanel({ niveles = [], subtitulo }) {
  const [nivelActivoId, setNivelActivoId] = useState(niveles?.[0]?.id ?? null);
  const [atletas, setAtletas] = useState([]);
  const [estados, setEstados] = useState({});
  const [guardada, setGuardada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [pendienteJustificar, setPendienteJustificar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [aviso, mostrarAviso] = useAviso();

  const modalGuardadoRef = useRef(null);
  const modalConsultarRef = useRef(null);

  const fechaHoy = fechaHoyISO();

  const nivelActivoIdEfectivo = niveles.some((n) => n.id === nivelActivoId)
    ? nivelActivoId
    : niveles?.[0]?.id ?? null;
  const nivel = niveles.find((n) => n.id === nivelActivoIdEfectivo) ?? niveles[0];

  useEffect(() => {
    if (!nivelActivoIdEfectivo) return;
    let cancelado = false;
    setCargando(true);
    setError("");

    Promise.all([
      obtenerAtletasPorNivel(nivelActivoIdEfectivo),
      obtenerRegistrosDia(nivelActivoIdEfectivo, fechaHoy),
    ])
      .then(([listaAtletas, registrosHoy]) => {
        if (cancelado) return;
        setAtletas(listaAtletas);
        const mapaEstados = {};
        registrosHoy.forEach((r) => {
          mapaEstados[r.atletaId] = { estado: r.estado, motivo: r.motivo ?? "" };
        });
        setEstados(mapaEstados);
        setGuardada(listaAtletas.length > 0 && registrosHoy.length >= listaAtletas.length);
      })
      .catch(() => {
        if (!cancelado) {
          setError("No se pudo conectar con el servidor de datos.");
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => { cancelado = true; };
  }, [nivelActivoIdEfectivo, fechaHoy]);

  const resumen = useMemo(() => {
    const valores = Object.values(estados);
    const presentes = valores.filter((e) => e.estado === "presente").length;
    const inpuntuales = valores.filter((e) => e.estado === "inpuntual").length;
    const faltas = valores.filter((e) => e.estado === "falta").length;
    const total = atletas.length;
    const porcentaje = total ? Math.round(((presentes + inpuntuales) / total) * 100) : 0;
    return { presentes, inpuntuales, faltas, total, porcentaje };
  }, [estados, atletas]);

  const atletasFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return atletas;
    return atletas.filter((a) => `${a.nombre} ${a.apellido}`.toLowerCase().includes(texto));
  }, [atletas, busqueda]);

  const cambiarNivel = (id) => {
    setNivelActivoId(id);
    setMenuAbierto(null);
  };

  const marcarEstado = (atletaId, estado) => {
    setEstados((prev) => ({ ...prev, [atletaId]: { estado, motivo: "" } }));
    setMenuAbierto(null);
  };

  const confirmarJustificacion = (motivo) => {
    if (pendienteJustificar == null) return;
    setEstados((prev) => ({ ...prev, [pendienteJustificar]: { estado: "justificado", motivo } }));
    setPendienteJustificar(null);
  };

  const toggleMenu = (atletaId) => {
    setMenuAbierto((actual) => (actual === atletaId ? null : atletaId));
  };

  const handleGuardar = () => modalGuardadoRef.current?.showModal();

  const confirmarGuardado = async () => {
    const sinMarcar = atletas.filter((a) => !estados[a.id]?.estado).length;
    const registros = atletas.map((a) => ({
      atletaId: a.id,
      estado: estados[a.id]?.estado ?? "falta",
      motivo: estados[a.id]?.motivo ?? "",
    }));
    try {
      await guardarAsistenciaDia(nivelActivoIdEfectivo, fechaHoy, registros);
      setGuardada(true);
      if (sinMarcar > 0) {
        mostrarAviso(
          `Guardado. ${sinMarcar} sin marcar ${sinMarcar === 1 ? "quedó" : "quedaron"} como falta.`,
          "advertencia"
        );
      } else {
        mostrarAviso("Asistencia guardada correctamente.", "ok");
      }
    } catch {
      mostrarAviso("No se pudo guardar la asistencia. Intenta de nuevo.", "error");
    }
  };

  const handleEditar = () => setGuardada(false);

  const atletaPendiente = atletas.find((a) => a.id === pendienteJustificar);

  if (!nivel) {
    return (
      <div className="p-4">
        <h1>Asistencia</h1>
        <p>No tienes ningún nivel asignado todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="asist-header">
        <div className="asist-header__titulo-bloque">
          <h1>Registrar asistencia</h1>
          <p>{subtitulo ?? "Gestione la asistencia y el historial de sus registros aquí."}</p>
        </div>

        <div className="asist-header__tabs-bloque">
          <div className="tabla-contenido">
            {niveles.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`tab-btn${n.id === nivelActivoIdEfectivo ? " tab-btn-activo" : ""}`}
                onClick={() => cambiarNivel(n.id)}
              >
                {n.categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-categoria">
        <ResumenCards
          total={resumen.total}
          porcentaje={resumen.porcentaje}
          presentesMasInpuntuales={resumen.presentes + resumen.inpuntuales}
          faltas={resumen.faltas}
        />

        <div className="asist-controles d-flex align-items-center gap-3 flex-wrap">
          <div className="asist-fecha">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{formatearFechaCorta(fechaHoy)}</span>
          </div>

          <button type="button" className="btn-consultar" onClick={() => modalConsultarRef.current?.showModal()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            Consultar asistencia
          </button>

          <div className="buscar-atleta">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Buscar atleta…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {error && <span className="asist-error">{error}</span>}
        </div>

        <div className="asist-tabla-wrapper">
          {cargando ? (
            <p className="asist-cargando">Cargando atletas…</p>
          ) : atletas.length === 0 ? (
            <p className="asist-cargando">No hay atletas registrados en este nivel.</p>
          ) : atletasFiltrados.length === 0 ? (
            <p className="asist-cargando">No se encontraron atletas con ese nombre.</p>
          ) : (
            <table className="asist-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {atletasFiltrados.map((atleta) => (
                  <FilaAtleta
                    key={atleta.id}
                    atleta={atleta}
                    estado={estados[atleta.id]?.estado}
                    motivo={estados[atleta.id]?.motivo}
                    bloqueada={guardada}
                    menuAbierto={menuAbierto === atleta.id}
                    onMarcar={(estado) => marcarEstado(atleta.id, estado)}
                    onToggleMenu={() => toggleMenu(atleta.id)}
                    onSeleccionEstado={(estado) => marcarEstado(atleta.id, estado)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="asist-footer-bar">
          {!guardada ? (
            <button type="button" className="btn-guardar btn-guardar-normal" onClick={handleGuardar} disabled={cargando || atletas.length === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Guardar asistencia
            </button>
          ) : (
            <button type="button" className="btn-guardar btn-editar-guardado" onClick={handleEditar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar asistencia
            </button>
          )}

          <div className="asist-paginacion asist-paginacion-footer">
            <span className="paginacion-info">Mostrando {atletasFiltrados.length} de {atletas.length} atletas</span>
            <div className="paginacion-btns">
              <button type="button" className="btn-pag" disabled>← Anterior</button>
              <button type="button" className="btn-pag btn-pag-num-activo">1</button>
              <button type="button" className="btn-pag" disabled>Siguiente →</button>
            </div>
          </div>
        </div>

        <div className={`asist-tip${guardada ? " asist-tip-ok" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
          {guardada
            ? "Asistencia guardada. Presiona \"Editar asistencia\" para hacer cambios."
            : "Recuerda guardar la asistencia antes de cerrar la sesión. Los cambios no guardados se perderán."}
        </div>
      </div>

      <ModalGuardado
        ref={modalGuardadoRef}
        categoriaLabel={nivel.categoria}
        fecha={formatearFechaLarga(fechaHoy)}
        onAceptar={confirmarGuardado}
      />
      <ModalConsultar
        ref={modalConsultarRef}
        nivel={nivel}
        atletas={atletas}
      />
      <AvisoToast aviso={aviso} />
    </div>
  );
}