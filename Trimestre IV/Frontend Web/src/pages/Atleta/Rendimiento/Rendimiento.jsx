import { useMemo, useState } from "react";
import { useSesion } from "../../../context/SesionContext";
import useAviso from "../../../Hooks/useAviso";
import useRendimientoAtleta from "../../../Hooks/useRendimientoAtleta";
import AvisoToast from "../../../components/Compartidos/AvisoToast";
import { enviarJustificacion } from "../../../services/rendimientoAtletaService";
import { fechaHoyISO } from "../../../services/data";
import {
  combinarHabilidades,
  construirHistorial,
  filasDelMes,
  resumenAsistencia,
  resumenHabilidades,
} from "../../../services/rendimientoCalculos";
import "./Rendimiento.css";
import "./Asistencia.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../../../components/Modal/AvisoToast.css";

import PerfilAtleta from "./PerfilAtleta";
import TarjetasResumen from "./TarjetasResumen";
import PanelHabilidades from "./PanelHabilidades";
import NotasEntrenador from "./NotasEntrenador";
import TabAsistencia from "./TabAsistencia";
import ModalJustificar from "./ModalJustificar";

const TABS = [
  { id: "rendimiento", etiqueta: "Rendimiento", icono: "bi-activity" },
  { id: "asistencia", etiqueta: "Asistencia", icono: "bi-calendar-event" },
];

function Rendimiento() {
  const { sesion } = useSesion();
  const atletaId = sesion?.atletaId ?? "1";

  const { datos, cargando, error, recargar } = useRendimientoAtleta(atletaId);
  const [tab, setTab] = useState("rendimiento");
  const [fechaJustificando, setFechaJustificando] = useState(null); 
  const [aviso, mostrarAviso] = useAviso();
  const [hoyISO] = useState(fechaHoyISO); 

  const habilidadesDelAtleta = useMemo(
    () => (datos ? combinarHabilidades(datos.habilidades, datos.progreso) : []),
    [datos]
  );
  const resumenHab = useMemo(() => resumenHabilidades(habilidadesDelAtleta), [habilidadesDelAtleta]);

  const historial = useMemo(
    () => (datos ? construirHistorial(datos.asistencias, datos.justificaciones) : []),
    [datos]
  );
  const asistenciaMes = useMemo(() => {
    const [anio, mes] = hoyISO.split("-").map(Number);
    return resumenAsistencia(filasDelMes(historial, anio, mes - 1));
  }, [historial, hoyISO]);

  const enviar = async ({ motivo, archivo }) => {
    const fila = historial.find((f) => f.fecha === fechaJustificando);
    await enviarJustificacion({
      atleta: datos.atleta,
      nivel: datos.nivel,
      nivelId: fila?.nivelId,
      fechaISO: fechaJustificando,
      motivo,
      archivo,
    });
    setFechaJustificando(null);
    recargar();
    mostrarAviso("✓ Justificación enviada correctamente", "ok");
  };

  if (!datos) {
    return (
      <main className="rend-atleta">
        <p className="rend-vacio" role={cargando ? "status" : "alert"}>
          {cargando ? "Cargando tu rendimiento..." : error || "No se encontró la información del atleta."}
        </p>
        {!cargando && (
          <p className="rend-vacio">
            <button type="button" className="rend-btn-justificar" onClick={recargar}>
              Reintentar
            </button>
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="rend-atleta">
      <div className="page-header">
        <h1>Mi Rendimiento Deportivo</h1>
        <p>
          Consulta tu historial de asistencia, nivel de desempeño, habilidades adquiridas y las
          notas de tu entrenador.
        </p>
      </div>

      {error && (
        <p className="rend-aviso-error" role="alert">
          {error}
        </p>
      )}

      <PerfilAtleta atleta={datos.atleta} />

      <div className="tabs-nav" role="tablist" aria-label="Secciones de rendimiento">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`rend-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`rend-panel-${t.id}`}
            className={`tab-btn${tab === t.id ? " activo" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <i className={`bi ${t.icono}`}></i>
            {t.etiqueta}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`rend-panel-${tab}`} aria-labelledby={`rend-tab-${tab}`}>
        {tab === "rendimiento" ? (
          <>
            <TarjetasResumen
              puntaje={resumenHab.porcentaje}
              completadas={resumenHab.completadas}
              total={resumenHab.total}
              asistencia={asistenciaMes}
            />

            <PanelHabilidades habilidades={habilidadesDelAtleta} cargando={cargando} />

            <NotasEntrenador notas={datos.notas} />
          </>
        ) : (
          <TabAsistencia
            historial={historial}
            justificaciones={datos.justificaciones}
            nivel={datos.nivel}
            hoyISO={hoyISO}
            onJustificar={setFechaJustificando}
          />
        )}
      </div>

      {fechaJustificando && (
        <ModalJustificar
          key={fechaJustificando}
          fechaISO={fechaJustificando}
          nivel={datos.nivel}
          onCerrar={() => setFechaJustificando(null)}
          onEnviar={enviar}
        />
      )}

      <AvisoToast aviso={aviso} />
    </main>
  );
}

export default Rendimiento;
