import { forwardRef, useEffect, useMemo, useState } from "react";
import { obtenerRegistrosRango, calcularResumen } from "../../../services/asistenciaService";
import { diasDeSesion, horarioDiasUnicos, nombreMes, hoy } from "../../../services/data";

const IconoPorEstado = {
  presente: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  ),
  falta: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  ),
  inpuntual: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ),
  justificado: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
  ),
};

function iniciales(nombre, apellido) {
  const palabras = `${nombre ?? ""} ${apellido ?? ""}`.trim().split(/\s+/);
  return palabras.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function exportarCSV(nivel, mesLabel, dias, atletas, historial) {
  const encabezado = ["Nombre", ...dias.map((d) => `${d.dia}`), "%"];
  const filas = atletas.map((atleta) => {
    const historialAtleta = historial[atleta.id] ?? {};
    const diasConRegistro = dias.filter(({ dia }) => historialAtleta[dia]);
    const diasPresentes = diasConRegistro.filter(
      ({ dia }) =>
        historialAtleta[dia].estado === "presente" || historialAtleta[dia].estado === "inpuntual"
    ).length;
    const porcentaje = dias.length ? Math.round((diasPresentes / dias.length) * 100) : 0;
    const celdas = dias.map(({ dia }) => historialAtleta[dia]?.estado ?? "");
    return [`${atleta.nombre} ${atleta.apellido}`, ...celdas, `${porcentaje}%`];
  });

  const csv = [encabezado, ...filas]
    .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `asistencia_${nivel?.categoria ?? "nivel"}_${mesLabel}.csv`.replace(/\s+/g, "_");
  a.click();
  URL.revokeObjectURL(url);
}

const ModalConsultar = forwardRef(function ModalConsultar({ nivel, atletas }, ref) {
  const ahora = hoy();
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [mesIndex, setMesIndex] = useState(ahora.getMonth());
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cerrar = () => ref.current?.close();

  const diasHorario = useMemo(() => horarioDiasUnicos(nivel?.horarios), [nivel]);
  const dias = useMemo(
    () => diasDeSesion(anio, mesIndex, diasHorario),
    [anio, mesIndex, diasHorario]
  );

  useEffect(() => {
    if (!nivel?.id || dias.length === 0) {
      setRegistros([]);
      return;
    }
    let cancelado = false;
    setCargando(true);
    const inicio = dias[0].fechaISO;
    const fin = dias[dias.length - 1].fechaISO;
    obtenerRegistrosRango(nivel.id, inicio, fin)
      .then((r) => { if (!cancelado) setRegistros(r); })
      .catch(() => { if (!cancelado) setRegistros([]); })
      .finally(() => { if (!cancelado) setCargando(false); });
    return () => { cancelado = true; };
  }, [nivel?.id, anio, mesIndex, dias.length]);

  const historial = useMemo(() => {
    const mapa = {};
    registros.forEach((r) => {
      const diaNum = Number(r.fecha.split("-")[2]);
      if (!mapa[r.atletaId]) mapa[r.atletaId] = {};
      mapa[r.atletaId][diaNum] = { estado: r.estado, motivo: r.motivo };
    });
    return mapa;
  }, [registros]);

  const resumenMes = useMemo(() => calcularResumen(registros), [registros]);

  const resumenTotales = useMemo(() => {
    const presentes = resumenMes.presentes;
    const inpuntuales = resumenMes.inpuntuales;
    const faltas = resumenMes.faltas + resumenMes.justificadas;
    const total = presentes + inpuntuales + faltas;
    const porcentaje = total ? Math.round(((presentes + inpuntuales) / total) * 100) : 0;
    return { presentes, inpuntuales, faltas, porcentaje };
  }, [resumenMes]);

  const atletasFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return atletas;
    return atletas.filter((a) => `${a.nombre} ${a.apellido}`.toLowerCase().includes(texto));
  }, [atletas, busqueda]);

  const justificaciones = useMemo(
    () =>
      registros
        .filter((r) => r.estado === "justificado" && r.motivo)
        .map((r) => {
          const atleta = atletas.find((a) => String(a.id) === String(r.atletaId));
          return {
            ...r,
            atletaNombre: atleta ? `${atleta.nombre} ${atleta.apellido}` : `Atleta #${r.atletaId}`,
          };
        })
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [registros, atletas]
  );

  const esMesActual = anio === ahora.getFullYear() && mesIndex === ahora.getMonth();
  const diaHoyNum = ahora.getDate();

  const mesAnterior = () => {
    if (mesIndex === 0) {
      setMesIndex(11);
      setAnio((a) => a - 1);
    } else {
      setMesIndex((m) => m - 1);
    }
  };

  const mesSiguiente = () => {
    if (mesIndex === 11) {
      setMesIndex(0);
      setAnio((a) => a + 1);
    } else {
      setMesIndex((m) => m + 1);
    }
  };

  return (
    <dialog ref={ref} id="modal-consultar">
      <div className="modal-consultar-contenido">
        <div className="modal-consultar-header d-flex align-items-center">
          <h2>Asistencia</h2>
          <span className="badge-categoria">{nivel?.categoria}</span>
          <button type="button" className="btn-cerrar-circular ms-auto" aria-label="Cerrar" onClick={cerrar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="resumen-mes-box">
          <div className="resumen-mes-pct">
            <span className="resumen-mes-num">{resumenTotales.porcentaje}%</span>
            <span className="resumen-mes-label">Asistencia de {nombreMes(mesIndex).toLowerCase()}</span>
          </div>
          <div className="resumen-mes-barra">
            <div className="resumen-mes-barra-fill" style={{ width: `${resumenTotales.porcentaje}%` }} />
          </div>

          <div className="resumen-mes-leyenda">
            <span><span className="leyenda-circulo leyenda-presente"></span> {resumenTotales.presentes} presentes</span>
            <span><span className="leyenda-circulo leyenda-inpuntual"></span> {resumenTotales.inpuntuales} inpuntuales</span>
            <span><span className="leyenda-circulo leyenda-falta"></span> {resumenTotales.faltas} faltas</span>
          </div>
        </div>

        <div className="consultar-mes-selector d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="selector-mes">
            <button type="button" className="btn-mes-nav" aria-label="Mes anterior" onClick={mesAnterior}>‹</button>
            {nombreMes(mesIndex)} {anio}
            <button type="button" className="btn-mes-nav" aria-label="Mes siguiente" onClick={mesSiguiente}>›</button>
          </div>

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
        </div>

        <div className="consultar-tabla-wrapper">
          {cargando ? (
            <p className="asist-cargando">Cargando historial…</p>
          ) : dias.length === 0 ? (
            <p className="asist-cargando">Este nivel no tiene sesiones programadas en este mes.</p>
          ) : (
            <table className="consultar-tabla-mes">
              <thead>
                <tr>
                  <th className="col-nombre-mes">Nombre</th>
                  {dias.map(({ dia, letra }) => (
                    <th key={dia} className={esMesActual && dia === diaHoyNum ? "dia-hoy" : ""}>
                      <span className="dia-num">{dia}</span>
                      <span className="dia-letra">{letra}</span>
                    </th>
                  ))}
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {atletasFiltrados.map((atleta) => {
                  const historialAtleta = historial[atleta.id] ?? {};
                  const diasConRegistro = dias.filter(({ dia }) => historialAtleta[dia]);
                  const diasPresentes = diasConRegistro.filter(
                    ({ dia }) =>
                      historialAtleta[dia].estado === "presente" ||
                      historialAtleta[dia].estado === "inpuntual"
                  ).length;
                  const porcentajeAtleta = dias.length
                    ? Math.round((diasPresentes / dias.length) * 100)
                    : 0;

                  return (
                    <tr key={atleta.id}>
                      <td className="col-nombre-mes">
                        <span className="avatar-iniciales">{iniciales(atleta.nombre, atleta.apellido)}</span>
                        {atleta.nombre} {atleta.apellido}
                      </td>
                      {dias.map(({ dia }) => {
                        const registro = historialAtleta[dia];
                        return (
                          <td key={dia} className={esMesActual && dia === diaHoyNum ? "dia-hoy" : ""}>
                            {registro && (
                              <span
                                className={`ico-${registro.estado}`}
                                title={registro.estado === "justificado" ? registro.motivo : undefined}
                              >
                                {IconoPorEstado[registro.estado]}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="col-porcentaje">{porcentajeAtleta}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {justificaciones.length > 0 && (
          <div className="justificaciones-lista">
            <h3>
              Justificaciones del mes
              <span className="justificaciones-count">{justificaciones.length}</span>
            </h3>
            <ul>
              {justificaciones.map((j) => (
                <li key={j.id}>
                  <span className="justificacion-fecha">{j.fecha.split("-").reverse().join("/")}</span>
                  <span className="justificacion-atleta">{j.atletaNombre}</span>
                  <span className="justificacion-motivo">{j.motivo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="calendario-leyenda">
          <span className="leyenda-item"><span className="ico-presente">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
            </svg>
          </span> Presente</span>
          <span className="leyenda-item"><span className="ico-inpuntual">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
            </svg></span> Inpuntual</span>
          <span className="leyenda-item"><span className="ico-falta">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </span> Falta</span>
          <span className="leyenda-item"><span className="ico-justificado">{IconoPorEstado.justificado}</span> Justificado</span>
          <span className="leyenda-item"><span className="leyenda-dia-hoy-num">{diaHoyNum}</span> Día de hoy</span>

          <button
            type="button"
            className="btn-exportar ms-auto"
            onClick={() => exportarCSV(nivel, `${nombreMes(mesIndex)}_${anio}`, dias, atletasFiltrados, historial)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Exportar
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ModalConsultar;