import { useEffect, useMemo, useState } from "react";
import { useSesion } from "../../../context/SesionContext";
import "./Rendimiento.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import PerfilAtleta from "./PerfilAtleta";
import TarjetasResumen from "./TarjetasResumen";
import PanelHabilidades from "./PanelHabilidades";
import NotasEntrenador from "./NotasEntrenador";

const API = "http://localhost:3001";

const pedir = (ruta) =>
  fetch(`${API}${ruta}`, { cache: "no-store" }).then((res) => (res.ok ? res.json() : null));

/**
 * Vista "Mi Rendimiento Deportivo" del atleta.
 * El atleta se toma de la sesión (sesion.atletaId), que cambia con el SelectorRol.
 */
function Rendimiento() {
  const { sesion } = useSesion();
  const atletaId = sesion?.atletaId ?? "1";

  const [atleta, setAtleta] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);

    Promise.all([
      pedir(`/atletas/${atletaId}`),
      pedir("/habilidades"),
      pedir(`/progresoHabilidades?atletaId=${atletaId}`),
      pedir(`/notas?atletaId=${atletaId}`),
    ])
      .then(([datosAtleta, datosHabilidades, datosProgreso, datosNotas]) => {
        if (cancelado) return;
        setAtleta(datosAtleta);
        setHabilidades(Array.isArray(datosHabilidades) ? datosHabilidades : []);
        setProgreso(Array.isArray(datosProgreso) ? datosProgreso : []);
        setNotas(Array.isArray(datosNotas) ? datosNotas : []);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        if (cancelado) return;
        setAtleta(null);
        setHabilidades([]);
        setProgreso([]);
        setNotas([]);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [atletaId]);

  // Cada habilidad del catálogo + si el atleta ya la completó
  const habilidadesDelAtleta = useMemo(
    () =>
      habilidades.map((h) => {
        const registro = progreso.find((p) => p.habilidadId === h.id);
        return { ...h, completado: registro ? registro.completado : false };
      }),
    [habilidades, progreso]
  );

  if (!atleta) {
    return (
      <main className="rend-atleta">
        <p className="rend-vacio">
          {cargando ? "Cargando tu rendimiento..." : "No se encontró la información del atleta."}
        </p>
      </main>
    );
  }

  const completadas = habilidadesDelAtleta.filter((h) => h.completado).length;

  return (
    <main className="rend-atleta">
      <div className="page-header">
        <h1>Mi Rendimiento Deportivo</h1>
        <p>
          Consulta tu nivel de desempeño, las habilidades adquiridas y las notas de tu
          entrenador.
        </p>
      </div>

      <PerfilAtleta atleta={atleta} />

      {/* Tabs: por ahora solo se ve Rendimiento. El botón de Asistencia no tiene contenido. */}
      <div className="tabs-nav" role="tablist">
        <button className="tab-btn activo" role="tab" aria-selected="true" type="button">
          <i className="bi bi-activity"></i>
          Rendimiento
        </button>
        <button className="tab-btn" role="tab" aria-selected="false" type="button">
          <i className="bi bi-calendar-event"></i>
          Asistencia
        </button>
      </div>

      <TarjetasResumen
        puntaje={Number(atleta.rendimiento) || 0}
        completadas={completadas}
        total={habilidadesDelAtleta.length}
      />

      <PanelHabilidades habilidades={habilidadesDelAtleta} cargando={cargando} />

      <NotasEntrenador notas={notas} />
    </main>
  );
}

export default Rendimiento;