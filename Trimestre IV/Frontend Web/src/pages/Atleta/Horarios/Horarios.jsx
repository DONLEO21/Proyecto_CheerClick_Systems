// src/pages/Atleta/Horarios/Horarios.jsx
import "./Horarios.css";
import React, { useState, useEffect, useMemo } from "react";

import FiltrosCategoria from "./FiltrosCategoria";
import TiraDias from "./TiraDias";
import TarjetaEntrenamiento from "./TarjetaEntrenamiento";
import TarjetaCampeonatoAtleta from "./TarjetaCampeonatoAtleta";
import ModalEntrenamientoAtleta from "./ModalEntrenamientoAtleta";
import ModalCampeonatoAtleta from "./ModalCampeonatoAtleta";
import ModalPago from "./ModalPago";
import AvisoToast from "../../../components/Compartidos/AvisoToast";

import { fechaAISO, obtenerLunesDeSemana, formatearRangoSemana, obtenerIniciales } from "./horariosAtletaData";

// ── API (json-server) ──────────────────────────────────────
const API_URL = "http://localhost:3001";
const jsonHeaders = { "Content-Type": "application/json" };

async function manejarRespuesta(res) {
  if (!res.ok) throw new Error(`Error ${res.status} al comunicarse con la API`);
  return res.json();
}

/**
 * props:
 *  - nivelId: id del nivel del atleta (por defecto 3 = Nivel 3 Magic,
 *    igual que el resto del proyecto mientras no exista login/auth real).
 */
export default function HorariosAtleta({ nivelId = 3 }) {
  // ── Datos ────────────────────────────────────────────────
  const [sesiones, setSesiones] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // READ: carga inicial
  useEffect(() => {
    let activo = true;
    setCargando(true);
    Promise.all([
      fetch(`${API_URL}/sesionesAtleta?nivelId=${nivelId}`).then(manejarRespuesta),
      fetch(`${API_URL}/torneos?nivel=magic`).then(manejarRespuesta),
      fetch(`${API_URL}/niveles/${nivelId}`).then(manejarRespuesta),
    ])
      .then(([s, t, nivel]) => {
        if (!activo) return;
        // El entrenador se toma del nivel (fuente única), no de cada sesión
        setSesiones(
          s.map((ses) => ({
            ...ses,
            entrenador: nivel.entrenador,
            iniciales: obtenerIniciales(nivel.entrenador),
          }))
        );
        setTorneos(t);
      })
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [nivelId]);

  // ── Aviso ────────────────────────────────────────────────
  const [aviso, setAviso] = useState({ visible: false, mensaje: "", tipo: "ok" });
  useEffect(() => {
    if (!aviso.visible) return;
    const id = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 3000);
    return () => clearTimeout(id);
  }, [aviso.visible, aviso.mensaje]);
  const mostrarAviso = (mensaje, tipo = "ok") => setAviso({ visible: true, mensaje, tipo });

  // ── Semana visible + filtro ──────────────────────────────
  const [lunes, setLunes] = useState(() => obtenerLunesDeSemana(new Date()));
  const [filtroActivo, setFiltroActivo] = useState("todos");

  const sesionesPorFecha = useMemo(() => {
    const mapa = {};
    sesiones.forEach((s) => {
      (mapa[s.fecha] ||= []).push(s);
    });
    return mapa;
  }, [sesiones]);

  const sesionesDeLaSemana = useMemo(() => {
    const resultado = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i);
      const iso = fechaAISO(d);
      if (sesionesPorFecha[iso]) resultado.push(...sesionesPorFecha[iso]);
    }
    return resultado;
  }, [lunes, sesionesPorFecha]);

  const sesionesFiltradas = useMemo(
    () => (filtroActivo === "todos" ? sesionesDeLaSemana : sesionesDeLaSemana.filter((s) => s.cat === filtroActivo)),
    [sesionesDeLaSemana, filtroActivo]
  );

  const totales = useMemo(() => {
    const horas = sesionesFiltradas.reduce((acc, s) => acc + parseFloat(s.duracion), 0);
    const disciplinas = new Set(sesionesFiltradas.map((s) => s.cat)).size;
    return { sesiones: sesionesFiltradas.length, horas, disciplinas };
  }, [sesionesFiltradas]);

  const cambiarSemana = (delta) => {
    setLunes((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + delta * 7));
  };

  // ── Modales ──────────────────────────────────────────────
  const [sesionModal, setSesionModal] = useState(null);
  const [campeonatoModal, setCampeonatoModal] = useState(null);
  const [pagoModal, setPagoModal] = useState(null); // torneo para el que se está pagando

  const abrirPagoDesdeTorneo = (torneo) => {
    setCampeonatoModal(null);
    setPagoModal(torneo);
  };

  // CREATE (POST): enviar comprobante de pago
  const enviarPago = (datosPago) => {
    return fetch(`${API_URL}/pagos`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ id: `pago-${Date.now()}`, ...datosPago }),
    })
      .then(manejarRespuesta)
      .then((creado) => {
        mostrarAviso("Comprobante enviado correctamente.", "ok");
        return creado;
      });
  };

  // ── Render ───────────────────────────────────────────────
  if (cargando) {
    return (
      <main className="contenido container-fluid py-5 text-center text-secondary">
        <div className="spinner-border text-danger mb-3" role="status" />
        <p>Cargando tus horarios…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contenido container-fluid py-5 text-center text-danger">
        <p className="fw-semibold mb-2">No se pudo conectar con la API.</p>
        <p className="text-secondary small mb-0">
          Verifica que json-server esté corriendo: <code>npx json-server db.json --port 3001</code>
        </p>
      </main>
    );
  }

  return (
    <main className="contenido">
      <section className="envoltura-horario" aria-labelledby="titulo-entrenamientos">
        <header className="encabezado-horario">
          <div className="bloque-titulo-horario">
            <h1 id="titulo-entrenamientos">Próximos Entrenamientos</h1>
            <p className="subtitulo-horario-atleta">Lunes 6–8 PM · Miércoles 6–8 PM · Sábados 4–6 PM</p>
          </div>
          <div className="chips-horario" aria-label="Estadísticas de la semana">
            <span className="chip-estadistica">
              <i className="bi bi-calendar3" />
              {totales.sesiones} sesión{totales.sesiones !== 1 ? "es" : ""}
            </span>
            <span className="chip-estadistica">
              <i className="bi bi-clock" />
              {totales.horas}h totales
            </span>
            <span className="chip-estadistica">
              <i className="bi bi-lightning-charge" />
              {totales.disciplinas} disciplina{totales.disciplinas !== 1 ? "s" : ""}
            </span>
          </div>
        </header>

        <FiltrosCategoria filtroActivo={filtroActivo} onCambiarFiltro={setFiltroActivo} />

        <nav className="navegador-semana" aria-label="Navegación por semanas">
          <button className="btn-semana" type="button" onClick={() => cambiarSemana(-1)}>
            <i className="bi bi-chevron-left" /> Semana anterior
          </button>
          <div className="centro-semana">
            <span className="etiqueta-rango-semana" aria-live="polite">{formatearRangoSemana(lunes)}</span>
            <TiraDias lunes={lunes} sesionesPorFecha={sesionesPorFecha} />
          </div>
          <button className="btn-semana" type="button" onClick={() => cambiarSemana(1)}>
            Semana siguiente <i className="bi bi-chevron-right" />
          </button>
        </nav>

        <div className="cuadricula-entrenamientos" role="list" aria-label="Sesiones de entrenamiento">
          {sesionesFiltradas.length ? (
            sesionesFiltradas.map((s) => (
              <TarjetaEntrenamiento key={s.id} sesion={s} onVerDetalles={setSesionModal} />
            ))
          ) : (
            <div className="estado-vacio">
              <i className="bi bi-calendar-x" />
              <p>
                {filtroActivo !== "todos"
                  ? `No hay sesiones de "${filtroActivo}" esta semana.`
                  : "No hay entrenamientos programados para esta semana."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="seccion-campeonatos" aria-labelledby="titulo-campeonatos">
        <header className="encabezado-seccion-campeonatos">
          <div className="bloque-titulo-seccion">
            <h2 id="titulo-campeonatos">Campeonatos Nivel 3</h2>
            <p className="subtitulo-seccion">Blood Tiger Magic — Temporada 2026</p>
          </div>
        </header>

        <div className="cuadricula-campeonatos" role="list">
          {torneos.map((t) => (
            <TarjetaCampeonatoAtleta
              key={t.id}
              torneo={t}
              onVerDetalles={setCampeonatoModal}
              onPagar={(torneo) => setPagoModal(torneo)}
            />
          ))}
        </div>
      </section>

      <ModalEntrenamientoAtleta sesion={sesionModal} onCerrar={() => setSesionModal(null)} />

      <ModalCampeonatoAtleta
        torneo={campeonatoModal}
        nivelEtiqueta="Nivel 3 Magic"
        onCerrar={() => setCampeonatoModal(null)}
        onPagar={abrirPagoDesdeTorneo}
      />

      {pagoModal && (
        <ModalPago torneo={pagoModal} onCerrar={() => setPagoModal(null)} onEnviar={enviarPago} />
      )}

      <AvisoToast aviso={aviso} />
    </main>
  );
}
