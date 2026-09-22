import "./Pagos.css";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/Client";
import AvisoToast from "../../../components/Modal/AvisoToast";
import Targetaestado from "./TargetaEstado";
import Paginacion from "./Paginacion";
import FiltrosMensualidades from "./FiltrosMensualidades";
import TablaMensualidades from "./TablaMensualidades";
import TarjetasCompetencia from "./TarjetasCompetencia";
import ModalFormularioPago from "./ModalFormularioPago";
import ModalComprobante from "./ModalComprobante";
import ModalDetalleCompetencia from "./ModalDetalleCompetencia";

const cop = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "—";

function Pagos() {
  const [pestana, setPestana] = useState("mensualidades");
  const itemsPorPagina = 6;


  const [atletas, setAtletas] = useState([]);
  const [mensualidades, setMensualidades] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [pagosCompetencia, setPagosCompetencia] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);


  const [busqueda, setBusqueda] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);


  const [pagoAEditar, setPagoAEditar] = useState(null); 
  const [comprobante, setComprobante] = useState(null); 
  const [detalleCompetencia, setDetalleCompetencia] = useState(null); 
  const [guardando, setGuardando] = useState(false);

  const [aviso, setAviso] = useState({ mensaje: "", tipo: "ok", visible: false });

  const mostrarAviso = (mensaje, tipo = "ok") => {
    setAviso({ mensaje, tipo, visible: true });
    setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 3000);
  };

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    Promise.all([
      fetch("http://localhost:3001/atletas").then((r) => r.json()),
      api.listar("mensualidades"),
      api.listar("planes"),
      api.listar("competencias"),
      api.listar("pagosCompetencia"),
    ])
      .then(([a, m, p, c, pc]) => {
        if (!vivo) return;
        setAtletas(Array.isArray(a) ? a : []);
        setMensualidades(m);
        setPlanes(p);
        setCompetencias(c);
        setPagosCompetencia(pc);
        setError(null);
      })
      .catch((e) => vivo && setError(e))
      .finally(() => vivo && setCargando(false));
    return () => { vivo = false; };
  }, []);

  const atletaPorId = useMemo(
    () => Object.fromEntries(atletas.map((a) => [a.id, a])),
    [atletas],
  );

  const mensualidadesConAtleta = useMemo(
    () => mensualidades.map((m) => ({ ...m, atleta: atletaPorId[m.atletaId] })),
    [mensualidades, atletaPorId],
  );

  const meses = useMemo(() => [...new Set(mensualidades.map((m) => m.mes))], [mensualidades]);

  const mensualidadesFiltradas = useMemo(
    () => mensualidadesConAtleta.filter((m) =>
      (m.atleta?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase().trim()) &&
      (!estadoSeleccionado || m.estado === estadoSeleccionado) &&
      (!mesSeleccionado || m.mes === mesSeleccionado) &&
      (!planSeleccionado || m.plan === planSeleccionado),
    ),
    [mensualidadesConAtleta, busqueda, estadoSeleccionado, mesSeleccionado, planSeleccionado],
  );

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const mensualidadesPaginadas = mensualidadesFiltradas.slice(inicio, inicio + itemsPorPagina);

  const totalRecaudado = mensualidades
    .filter((m) => m.estado === "pagado")
    .reduce((t, m) => t + m.valor, 0);
  const totalPendiente = mensualidades
    .filter((m) => m.estado !== "pagado")
    .reduce((t, m) => t + m.valor, 0);
  const atletasAlDia = mensualidades.filter((m) => m.registrado).length;

  // ── Competencias ──
  const pagosCompetenciaConAtleta = useMemo(
    () => pagosCompetencia.map((p) => ({ ...p, atleta: atletaPorId[p.atletaId] })),
    [pagosCompetencia, atletaPorId],
  );

  const competenciasConProgreso = useMemo(() => competencias.map((c) => {
    const pagos = pagosCompetenciaConAtleta.filter((p) => p.competenciaId === c.id);
    const validados = pagos.filter((p) => p.estado === "validado").length;
    return {
      ...c,
      pagados: pagos.length,
      validados,
      recaudado: pagos.reduce((t, p) => t + p.valor, 0),
      porcentaje: c.inscritos ? Math.round((pagos.length / c.inscritos) * 100) : 0,
    };
  }), [competencias, pagosCompetenciaConAtleta]);

  const grupos = useMemo(() => {
    const niveles = [...new Set(competenciasConProgreso.map((c) => c.nivel))];
    return niveles.map((nivel) => ({
      nivel,
      equipo: competenciasConProgreso.find((c) => c.nivel === nivel).equipo,
      tarjetas: competenciasConProgreso.filter((c) => c.nivel === nivel),
    }));
  }, [competenciasConProgreso]);

  const pagosDeLaCompetenciaAbierta = useMemo(
    () => (detalleCompetencia
      ? pagosCompetenciaConAtleta.filter((p) => p.competenciaId === detalleCompetencia.id)
      : []),
    [detalleCompetencia, pagosCompetenciaConAtleta],
  );

  async function abrirRegistroMensualidad(pago) {
    setPagoAEditar({
      tipo: "mensualidad",
      id: pago.id,
      atleta: pago.atleta,
      etiquetas: [{ texto: pago.mes }, { texto: pago.plan }],
      generacion: pago.generacion,
      valor: pago.valor,
      estadoTexto: pago.estado === "vencido" ? "Vencido" : "Pendiente",
    });
  }

  function abrirValidacionCompetencia(pago) {
    setPagoAEditar({
      tipo: "competencia",
      id: pago.id,
      atleta: pago.atleta,
      etiquetas: [{ texto: detalleCompetencia?.nombre ?? "" }],
      generacion: pago.generacion,
      valor: pago.valor,
      estadoTexto: "Por validar",
    });
    setDetalleCompetencia(null);
  }

  async function guardarPago(datos) {
    setGuardando(true);
    try {
      if (pagoAEditar.tipo === "mensualidad") {
        const actualizado = await api.actualizar("mensualidades", pagoAEditar.id, {
          ...datos, estado: "pagado", registrado: true,
        });
        setMensualidades((prev) => prev.map((m) => (m.id === actualizado.id ? actualizado : m)));
        mostrarAviso("Pago registrado correctamente");
      } else {
        const actualizado = await api.actualizar("pagosCompetencia", pagoAEditar.id, {
          ...datos, estado: "validado",
        });
        setPagosCompetencia((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
        mostrarAviso("Pago validado correctamente");
      }
      setPagoAEditar(null);
    } catch (e) {
      console.error(e);
      mostrarAviso("No se pudo guardar el pago", "error");
    } finally {
      setGuardando(false);
    }
  }

  function verComprobanteMensualidad(pago) {
    setComprobante({
      tipo: "mensualidad",
      atleta: pago.atleta,
      etiqueta: pago.mes,
      archivo: pago.comprobante,
      referencia: pago.referencia,
      metodo: pago.metodo,
      fecha: pago.fechaPago,
    });
  }

  function verComprobanteCompetencia(pago) {
    setComprobante({
      tipo: "competencia",
      atleta: pago.atleta,
      etiqueta: detalleCompetencia?.nombre ?? "",
      archivo: pago.comprobante,
      referencia: pago.referencia,
      metodo: pago.metodo,
      fecha: pago.fechaPago,
    });
    setDetalleCompetencia(null);
  }

  if (cargando) {
    return (
      <div className="conteni">
        <aside id="titu-ren"><h3>Estado Pagos</h3><p>Cargando información de pagos…</p></aside>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conteni">
        <aside id="titu-ren">
          <h3>Estado Pagos</h3>
          <p>No se pudo cargar la información: {error.message}. Verifica que json-server esté corriendo en el puerto 3001.</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="conteni">
      <aside id="titu-ren">
        <h3>Estado Pagos</h3>
        <p>
          Controla el estado de pagos de mensualidades y competencias, registra nuevos
          pagos y consulta el historial de cada atleta.
        </p>
      </aside>

      <div className="tabs-pagos">
        <button
          className={"tab-btn" + (pestana === "mensualidades" ? " tab-btn--activo" : "")}
          onClick={() => setPestana("mensualidades")}
        >
          Mensualidades
        </button>
        <button
          className={"tab-btn" + (pestana === "competencias" ? " tab-btn--activo" : "")}
          onClick={() => setPestana("competencias")}
        >
          Pagos de competencia
        </button>
      </div>

      {pestana === "mensualidades" && (
        <>
          <section id="targetas">
            <div className="container">
              <div className="row mt-3">
                <div className="col-lg-4">
                  <Targetaestado titulo="Total recaudado" dato={cop(totalRecaudado)} texto="Marzo" />
                </div>
                <div className="col-lg-4">
                  <Targetaestado titulo="Pendiente por pagar" dato={cop(totalPendiente)} texto="por cobrar" />
                </div>
                <div className="col-lg-4">
                  <Targetaestado titulo="Atletas al día" dato={`${atletasAlDia} / ${mensualidades.length}`} texto="pagos verificados" />
                </div>
              </div>
            </div>
          </section>

          <FiltrosMensualidades
            busqueda={busqueda}
            setBusqueda={(v) => { setBusqueda(v); setPaginaActual(1); }}
            estadoSeleccionado={estadoSeleccionado}
            setEstadoSeleccionado={(v) => { setEstadoSeleccionado(v); setPaginaActual(1); }}
            mesSeleccionado={mesSeleccionado}
            setMesSeleccionado={(v) => { setMesSeleccionado(v); setPaginaActual(1); }}
            planSeleccionado={planSeleccionado}
            setPlanSeleccionado={(v) => { setPlanSeleccionado(v); setPaginaActual(1); }}
            meses={meses}
            planes={planes}
          />

          <TablaMensualidades
            pagos={mensualidadesPaginadas}
            onRegistrar={abrirRegistroMensualidad}
            onVerComprobante={verComprobanteMensualidad}
          />

          <Paginacion
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            totalItems={mensualidadesFiltradas.length}
            itemsPorPagina={itemsPorPagina}
          />
        </>
      )}

      {pestana === "competencias" && (
        <TarjetasCompetencia grupos={grupos} onVerDetalle={setDetalleCompetencia} />
      )}

      <ModalFormularioPago
        pago={pagoAEditar}
        guardando={guardando}
        onCerrar={() => setPagoAEditar(null)}
        onGuardar={guardarPago}
      />

      <ModalComprobante
        comprobante={comprobante}
        onCerrar={() => setComprobante(null)}
      />

      <ModalDetalleCompetencia
        competencia={detalleCompetencia}
        pagos={pagosDeLaCompetenciaAbierta}
        onCerrar={() => setDetalleCompetencia(null)}
        onValidar={abrirValidacionCompetencia}
        onVerComprobante={verComprobanteCompetencia}
      />

      <AvisoToast aviso={aviso} />
    </div>
  );
}

export default Pagos;