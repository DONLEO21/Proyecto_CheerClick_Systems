
import "./PQRS.css";
import React, { useMemo, useState, useEffect } from "react";

import ResumenCard from "./ResumenCard";
import FiltrosPqrs from "./FiltrosPqrs";
import TablaPqrs from "./TablaPqrs";
import ModalResponder from "./ModalResponder";
import ModalModificar from "./ModalModificar";
import AvisoToast from "../../../components/Compartidos/AvisoToast";

import { FILTROS_INICIALES, radicadoDe } from "./pqrsData";

const API_URL = "http://localhost:3001";
const jsonHeaders = { "Content-Type": "application/json" };

async function manejarRespuesta(res) {
  if (!res.ok) throw new Error(`Error ${res.status} al comunicarse con la API`);
  return res.json();
}

const ESTADO_INICIAL_RESPUESTA = { respuesta: "", estado: "tramite" };

const ESTADO_INICIAL_MODIFICAR = {
  tipo: "",
  asunto: "",
  descripcion: "",
  estado: "",
  prioridad: "",
};

const fechaHoy = () => {
  const h = new Date();
  const dos = (n) => String(n).padStart(2, "0");
  return `${h.getFullYear()}-${dos(h.getMonth() + 1)}-${dos(h.getDate())}`;
};


const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function PQRS() {

  const [pqrs, setPqrs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [enviando, setEnviando] = useState(false);


  useEffect(() => {
    let activo = true;
    setCargando(true);

    fetch(`${API_URL}/pqrs`)
      .then(manejarRespuesta)
      .then((datos) => {
        if (!activo) return;
        setPqrs(datos);
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


  const [modalResponder, setModalResponder] = useState({ abierto: false, seleccionada: null });
  const [formResponder, setFormResponder] = useState(ESTADO_INICIAL_RESPUESTA);

  const [modalModificar, setModalModificar] = useState({ abierto: false, seleccionada: null });
  const [formModificar, setFormModificar] = useState(ESTADO_INICIAL_MODIFICAR);

  const totales = useMemo(() => {
    const activas = pqrs.filter((p) => !p.inhabilitada);
    return {
      pendiente: activas.filter((p) => p.estado === "pendiente").length,
      tramite: activas.filter((p) => p.estado === "tramite").length,
      resuelto: activas.filter((p) => p.estado === "resuelto").length,
    };
  }, [pqrs]);

  const filas = useMemo(() => {
    const consulta = normalizar(filtros.busqueda.trim());

    const resultado = pqrs.filter(
      (p) =>
        (!filtros.tipo || p.tipo === filtros.tipo) &&
        (!filtros.estado || p.estado === filtros.estado) &&
        (!filtros.prioridad || p.prioridad === filtros.prioridad) &&
        (!consulta || normalizar(`${radicadoDe(p)} ${p.asunto} ${p.descripcion} ${p.remitente}`).includes(consulta))
    );

    if (filtros.orden) {
      const sentido = filtros.orden === "asc" ? 1 : -1;
      return resultado.sort((a, b) => sentido * radicadoDe(a).localeCompare(radicadoDe(b)));
    }

    return resultado.sort((a, b) => b.fecha.localeCompare(a.fecha) || radicadoDe(b).localeCompare(radicadoDe(a)));
  }, [pqrs, filtros]);

  const cambiarFiltro = (campo, valor) =>
    setFiltros((previo) => ({ ...previo, [campo]: valor }));

  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);


  const abrirResponder = (solicitud) => {
    setFormResponder({ ...ESTADO_INICIAL_RESPUESTA, respuesta: solicitud.respuesta ?? "" });
    setModalResponder({ abierto: true, seleccionada: solicitud });
  };

  const cerrarModalResponder = () => setModalResponder((m) => ({ ...m, abierto: false }));

  // UPDATE (PATCH)
  const guardarRespuesta = (e) => {
    e.preventDefault();
    const respuesta = formResponder.respuesta.trim();
    if (!respuesta) return mostrarAviso("Escribe la respuesta antes de enviarla.", "error");

    const { id } = modalResponder.seleccionada;
    setEnviando(true);
    fetch(`${API_URL}/pqrs/${id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ respuesta, estado: formResponder.estado, fechaRespuesta: fechaHoy() }),
    })
      .then(manejarRespuesta)
      .then((actualizada) => {
        setPqrs((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
        mostrarAviso("Respuesta enviada.", "ok");
        cerrarModalResponder();
      })
      .catch(avisoErrorApi)
      .finally(() => setEnviando(false));
  };

  /* ═══════════════════ MODIFICAR ═══════════════════ */

  const abrirModificar = (solicitud) => {
    const { tipo, asunto, descripcion, estado, prioridad } = solicitud;
    setFormModificar({ tipo, asunto, descripcion, estado, prioridad });
    setModalModificar({ abierto: true, seleccionada: solicitud });
  };

  const cerrarModalModificar = () => setModalModificar((m) => ({ ...m, abierto: false }));

  // UPDATE (PATCH)
  const guardarModificacion = (e) => {
    e.preventDefault();
    const asunto = formModificar.asunto.trim();
    const descripcion = formModificar.descripcion.trim();
    if (!asunto) return mostrarAviso("El asunto es obligatorio.", "error");
    if (!descripcion) return mostrarAviso("La descripción es obligatoria.", "error");

    const { id } = modalModificar.seleccionada;
    setEnviando(true);
    fetch(`${API_URL}/pqrs/${id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ ...formModificar, asunto, descripcion }),
    })
      .then(manejarRespuesta)
      .then((actualizada) => {
        setPqrs((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
        mostrarAviso("Cambios guardados.", "ok");
        cerrarModalModificar();
      })
      .catch(avisoErrorApi)
      .finally(() => setEnviando(false));
  };

  /* ═══════════════════ INHABILITAR / HABILITAR ═══════════════════ */

  // UPDATE parcial
  const alternarPqrsHandler = (solicitud) => {
    const inhabilitada = !solicitud.inhabilitada;
    fetch(`${API_URL}/pqrs/${solicitud.id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ inhabilitada }),
    })
      .then(manejarRespuesta)
      .then((actualizada) => {
        setPqrs((prev) => prev.map((p) => (p.id === solicitud.id ? actualizada : p)));
        mostrarAviso(
          `${radicadoDe(solicitud)} ${inhabilitada ? "inhabilitada" : "habilitada"}.`,
          inhabilitada ? "advertencia" : "ok"
        );
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
    <main className="contenido container-fluid py-4 px-3 px-md-4 pqrs-page">
      <header className="pqrs-cabecera pqrs-entrada">
        <h1>PQRS</h1>
        <p>Gestiona las peticiones, quejas, reclamos y sugerencias de los miembros del club deportivo.</p>
      </header>

      <section
        className="d-flex flex-wrap gap-4 mb-4 pqrs-entrada"
        style={{ "--retraso": ".1s" }}
        aria-label="Resumen de PQRS activas"
      >
        <ResumenCard
          tipo="pendiente"
          icono="bi-chat-dots-fill"
          cantidad={totales.pendiente}
          etiqueta="Pendiente(s)"
        />
        <ResumenCard
          tipo="tramite"
          icono="bi-check-lg"
          cantidad={totales.tramite}
          etiqueta="En Trámite(s)"
        />
        <ResumenCard
          tipo="resuelto"
          icono="bi-check-lg"
          cantidad={totales.resuelto}
          etiqueta="Resuelto(s)"
        />
      </section>

      <section
        className="pqrs-caja pqrs-entrada"
        style={{ "--retraso": ".2s" }}
        aria-label="Listado de PQRS"
      >
        <FiltrosPqrs filtros={filtros} onCambio={cambiarFiltro} onLimpiar={limpiarFiltros} />
        <TablaPqrs
          filas={filas}
          onResponder={abrirResponder}
          onModificar={abrirModificar}
          onInhabilitar={alternarPqrsHandler}
        />
      </section>

      <ModalResponder
        abierto={modalResponder.abierto}
        pqrs={modalResponder.seleccionada}
        form={formResponder}
        setForm={setFormResponder}
        enviando={enviando}
        onCerrar={cerrarModalResponder}
        onGuardar={guardarRespuesta}
      />

      <ModalModificar
        abierto={modalModificar.abierto}
        pqrs={modalModificar.seleccionada}
        form={formModificar}
        setForm={setFormModificar}
        enviando={enviando}
        onCerrar={cerrarModalModificar}
        onGuardar={guardarModificacion}
      />

      <AvisoToast aviso={aviso} />
    </main>
  );
}
