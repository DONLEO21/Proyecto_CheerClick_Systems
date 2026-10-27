
import "./Horarios.css";
import React, { useMemo, useState, useEffect } from "react";

import NivelCard from "./NivelCard";
import CompetenciaCard from "./CompetenciaCard";
import ModalNivel from "./ModalNivel";
import ModalCompetencia from "./ModalCompetencia";
import AvisoToast from "../../../components/Compartidos/AvisoToast";

import { nivelesCompetencia, contarPorNivel } from "./horariosData";

const API_URL = "http://localhost:3001";
const jsonHeaders = { "Content-Type": "application/json" };

async function manejarRespuesta(res) {
  if (!res.ok) throw new Error(`Error ${res.status} al comunicarse con la API`);
  return res.json();
}

const ESTADO_INICIAL_NIVEL = {
  id: null,
  categoria: "",
  entrenador: "",
  foto: "",
  horarios: [{ dias: [], inicio: "18:00", fin: "20:00" }],
};

const ESTADO_INICIAL_TORNEO = {
  id: null,
  nombre: "",
  fecha: "",
  ciudad: "",
  costo: "",
  limite: "",
  etiquetaLimite: "Límite de pago",
  nivel: "",
  imagen: "",
  link: "",
};

export default function Horarios() {
  const [niveles, setNiveles] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    Promise.all([
      fetch(`${API_URL}/niveles`).then(manejarRespuesta),
      fetch(`${API_URL}/torneos`).then(manejarRespuesta),
    ])
      .then(([n, t]) => {
        if (!activo) return;
        setNiveles(n);
        setTorneos(t);
      })
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  const [aviso, setAviso] = useState({ visible: false, mensaje: "", tipo: "ok" });

  useEffect(() => {
    if (!aviso.visible) return;
    const id = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 3000);
    return () => clearTimeout(id);
  }, [aviso.visible, aviso.mensaje]);

  const mostrarAviso = (mensaje, tipo = "ok") => setAviso({ visible: true, mensaje, tipo });
  const avisoErrorApi = () =>
    mostrarAviso("No se pudo conectar con la API (json-server). ¿Está corriendo?", "error");

  const [tabActiva, setTabActiva] = useState("niveles");
  const [subTabActiva, setSubTabActiva] = useState("queen");


  const [modalNivelAbierto, setModalNivelAbierto] = useState(false);
  const [formNivel, setFormNivel] = useState(ESTADO_INICIAL_NIVEL);

  const [modalCompetencia, setModalCompetencia] = useState({ abierto: false, modo: "registrar" });
  const [formCompetencia, setFormCompetencia] = useState(ESTADO_INICIAL_TORNEO);

  const torneosDelSubTab = useMemo(
    () => torneos.filter((t) => t.nivel === subTabActiva),
    [torneos, subTabActiva]
  );

  /* ═══════════════════ CRUD NIVELES ═══════════════════ */

  const abrirNuevoNivel = () => {
    setFormNivel(ESTADO_INICIAL_NIVEL);
    setModalNivelAbierto(true);
  };

  const abrirEditarNivel = (nivel) => {
    setFormNivel({
      ...nivel,
      horarios: nivel.horarios.map((b) => ({ ...b, dias: [...b.dias] })),
    });
    setModalNivelAbierto(true);
  };

  const guardarNivel = () => {
    const categoria = formNivel.categoria.trim();
    const entrenador = formNivel.entrenador.trim();
    if (!categoria) return mostrarAviso("El nombre del nivel es obligatorio.", "error");
    if (!entrenador) return mostrarAviso("El nombre del entrenador es obligatorio.", "error");

    for (const bloque of formNivel.horarios) {
      if (!bloque.dias.length) {
        return mostrarAviso("Cada horario debe tener al menos un día seleccionado.", "error");
      }
      if (!bloque.inicio || !bloque.fin || bloque.inicio >= bloque.fin) {
        return mostrarAviso("Revisa las horas: la de fin debe ser mayor a la de inicio.", "error");
      }
    }

    const datos = { categoria, entrenador, foto: formNivel.foto, horarios: formNivel.horarios };

    if (formNivel.id !== null) {
      // UPDATE
      fetch(`${API_URL}/niveles/${formNivel.id}`, {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(datos),
      })
        .then(manejarRespuesta)
        .then((actualizado) => {
          setNiveles((prev) => prev.map((n) => (n.id === formNivel.id ? actualizado : n)));
          mostrarAviso("Cambios guardados.", "ok");
          setModalNivelAbierto(false);
        })
        .catch(avisoErrorApi);
    } else {
      // CREATE
      const nuevoId = niveles.length ? Math.max(...niveles.map((n) => n.id)) + 1 : 0;
      fetch(`${API_URL}/niveles`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ id: nuevoId, inhabilitado: false, ...datos }),
      })
        .then(manejarRespuesta)
        .then((creado) => {
          setNiveles((prev) => [...prev, creado]);
          mostrarAviso("Nivel creado.", "ok");
          setModalNivelAbierto(false);
        })
        .catch(avisoErrorApi);
    }
  };

  // UPDATE parcial inhabilitar / habilitar
  const alternarNivelHandler = (nivel) => {
    fetch(`${API_URL}/niveles/${nivel.id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ inhabilitado: !nivel.inhabilitado }),
    })
      .then(manejarRespuesta)
      .then((actualizado) => {
        setNiveles((prev) => prev.map((n) => (n.id === nivel.id ? actualizado : n)));
      })
      .catch(avisoErrorApi);
  };

  // DELETE 
  const eliminarNivel = (id) => {
    fetch(`${API_URL}/niveles/${id}`, { method: "DELETE" })
      .then(manejarRespuesta)
      .then(() => {
        setNiveles((prev) => prev.filter((n) => n.id !== id));
        mostrarAviso("Nivel eliminado.", "ok");
      })
      .catch(avisoErrorApi);
  };

  /* ═══════════════════ CRUD COMPETENCIAS ═══════════════════ */

  const abrirRegistrarCompetencia = () => {
    setFormCompetencia({ ...ESTADO_INICIAL_TORNEO, nivel: subTabActiva });
    setModalCompetencia({ abierto: true, modo: "registrar" });
  };

  const abrirModificarCompetencia = (torneo) => {
    setFormCompetencia({ ...torneo });
    setModalCompetencia({ abierto: true, modo: "modificar" });
  };

  const cerrarModalCompetencia = () => setModalCompetencia((m) => ({ ...m, abierto: false }));

  // CREATE (POST) / UPDATE (PATCH)
  const guardarCompetencia = (e) => {
    e.preventDefault();
    const { nombre, fecha, ciudad, costo, limite, nivel } = formCompetencia;
    if (!nombre.trim() || !fecha || !ciudad.trim() || !costo || !limite || !nivel) {
      return mostrarAviso("Completa todos los campos obligatorios.", "error");
    }

    const datos = {
      nombre: nombre.trim(),
      fecha,
      ciudad: ciudad.trim(),
      costo: Number(costo),
      limite,
      nivel,
      imagen: formCompetencia.imagen || "",
      link: formCompetencia.link || "",
      etiquetaLimite: formCompetencia.etiquetaLimite || "Límite de pago",
    };

    if (modalCompetencia.modo === "registrar") {
      // CREATE
      const nuevoId = `${nivel}-${Date.now()}`;
      fetch(`${API_URL}/torneos`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          id: nuevoId,
          clave: "personalizada",
          activa: true,
          inhabilitada: false,
          ...datos,
        }),
      })
        .then(manejarRespuesta)
        .then((creado) => {
          setTorneos((prev) => [...prev, creado]);
          setSubTabActiva(nivel);
          mostrarAviso("Competencia registrada.", "ok");
          cerrarModalCompetencia();
        })
        .catch(avisoErrorApi);
    } else {
      // UPDATE
      fetch(`${API_URL}/torneos/${formCompetencia.id}`, {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(datos),
      })
        .then(manejarRespuesta)
        .then((actualizado) => {
          setTorneos((prev) => prev.map((t) => (t.id === formCompetencia.id ? actualizado : t)));
          setSubTabActiva(nivel);
          mostrarAviso("Cambios del torneo guardados.", "ok");
          cerrarModalCompetencia();
        })
        .catch(avisoErrorApi);
    }
  };

  // UPDATE parcial inhabilitar / habilitar
  const alternarTorneoHandler = (torneo) => {
    fetch(`${API_URL}/torneos/${torneo.id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ inhabilitada: !torneo.inhabilitada }),
    })
      .then(manejarRespuesta)
      .then((actualizado) => {
        setTorneos((prev) => prev.map((t) => (t.id === torneo.id ? actualizado : t)));
      })
      .catch(avisoErrorApi);
  };

  // DELETE 
  const eliminarTorneo = (id) => {
    fetch(`${API_URL}/torneos/${id}`, { method: "DELETE" })
      .then(manejarRespuesta)
      .then(() => {
        setTorneos((prev) => prev.filter((t) => t.id !== id));
        mostrarAviso("Competencia eliminada.", "ok");
      })
      .catch(avisoErrorApi);
  };

  

  if (cargando) {
    return (
      <main className="contenido container-fluid py-5 text-center text-secondary">
        <div className="spinner-border text-danger mb-3" role="status" />
        <p>Cargando información…</p>
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
    <main className="contenido container-fluid py-4 px-3 px-md-4">
      <div className="encabezado-pagina mb-3">
        <h1 className="h3 fw-bold mb-1">Panel de Gestión</h1>
        <p className="text-secondary mb-0">Niveles, horarios y competencias del club</p>
      </div>

      <nav className="barra-pestanias d-flex mb-4">
        <button
          type="button"
          className={`etiqueta-pestania ${tabActiva === "niveles" ? "activa" : ""}`}
          onClick={() => setTabActiva("niveles")}
        >
          <i className="bi bi-people-fill" />
          Niveles &amp; Horarios
        </button>
        <button
          type="button"
          className={`etiqueta-pestania ${tabActiva === "competencias" ? "activa" : ""}`}
          onClick={() => setTabActiva("competencias")}
        >
          <i className="bi bi-trophy-fill" />
          Competencias
        </button>
      </nav>

      {tabActiva === "niveles" && (
        <section>
          <div className="encabezado-panel d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 gap-2">
            <div>
              <h2 className="titulo-panel">Niveles de Entrenamiento</h2>
              <p className="descripcion-panel">Gestiona los niveles y sus entrenadores</p>
            </div>
            <button type="button" className="btn-nueva-categoria" onClick={abrirNuevoNivel}>
              <i className="bi bi-plus-lg" />
              Nuevo Nivel
            </button>
          </div>

          <div className="row g-4">
            {niveles.map((nivel, i) => (
              <div className="col-12 col-md-6 col-xl-4" key={nivel.id}>
                <NivelCard
                  nivel={nivel}
                  onModificar={abrirEditarNivel}
                  onInhabilitar={alternarNivelHandler}
                  delay={i * 0.08}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {tabActiva === "competencias" && (
        <section>
          <div className="encabezado-panel d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 gap-2">
            <div>
              <h2 className="titulo-panel">Competencias Activas</h2>
              <p className="descripcion-panel">Torneos programados por equipo</p>
            </div>
            <button type="button" className="btn-nueva-competencia" onClick={abrirRegistrarCompetencia}>
              <i className="bi bi-trophy" />
              Registrar Competencia
            </button>
          </div>

          <nav className="barra-sub-pestanias d-flex flex-wrap gap-2 mb-4">
            {nivelesCompetencia.map((n) => (
              <button
                key={n.valor}
                type="button"
                className={`sub-etiqueta ${subTabActiva === n.valor ? "activa" : ""}`}
                onClick={() => setSubTabActiva(n.valor)}
              >
                <i className="bi bi-trophy sub-tab-icon" />
                {n.etiqueta.replace(/\s*\(.*\)/, "")}
                <span className="sub-count">{contarPorNivel(torneos, n.valor)}</span>
              </button>
            ))}
          </nav>

          <div className="row g-4">
            {torneosDelSubTab.map((t, i) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={t.id}>
                <CompetenciaCard
                  torneo={t}
                  onModificar={abrirModificarCompetencia}
                  onInhabilitar={alternarTorneoHandler}
                  delay={i * 0.06}
                />
              </div>
            ))}
            {!torneosDelSubTab.length && (
              <p className="text-secondary">No hay competencias registradas para este nivel.</p>
            )}
          </div>
        </section>
      )}

      <ModalNivel
        abierto={modalNivelAbierto}
        formNivel={formNivel}
        setFormNivel={setFormNivel}
        onCerrar={() => setModalNivelAbierto(false)}
        onGuardar={guardarNivel}
      />

      <ModalCompetencia
        abierto={modalCompetencia.abierto}
        modo={modalCompetencia.modo}
        form={formCompetencia}
        setForm={setFormCompetencia}
        onCerrar={cerrarModalCompetencia}
        onGuardar={guardarCompetencia}
      />

      <AvisoToast aviso={aviso} />
    </main>
  );
}
