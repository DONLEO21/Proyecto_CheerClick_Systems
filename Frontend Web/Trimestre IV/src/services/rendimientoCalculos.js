// Cálculos puros de la pantalla "Mi Rendimiento Deportivo" del atleta.
// No hacen peticiones ni usan React: reciben los datos ya cargados y devuelven lo que la
// pantalla necesita mostrar. Así se pueden probar solos y los componentes quedan simples.
import { aISO } from "./data";

export const ETIQUETA_ASISTENCIA = {
  presente: "Presente",
  falta: "Falta",
  inpuntual: "Inpuntual",
  justificado: "Justificado",
};

export const ETIQUETA_JUSTIFICACION = {
  pendiente: "En revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

const CODIGO_DIA = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
const MES_ABREVIADO = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function mismoId(a, b) {
  return String(a) === String(b);
}

function partesFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  return { anio, mes, dia };
}

export function fechaCortaTabla(fechaISO) {
  const { anio, mes, dia } = partesFecha(fechaISO);
  return `${String(dia).padStart(2, "0")} ${MES_ABREVIADO[mes - 1]} ${anio}`;
}

export function diaYMes(fechaISO) {
  const { mes, dia } = partesFecha(fechaISO);
  return { dia: String(dia).padStart(2, "0"), mes: MES_ABREVIADO[mes - 1] };
}

export function formatearTamano(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function resolverNivel(atleta, atletasAsistencia, niveles) {
  const enAsistencia = atletasAsistencia.find((a) => mismoId(a.id, atleta.id));
  const porId = enAsistencia && niveles.find((n) => mismoId(n.id, enAsistencia.nivelId));
  if (porId) return porId;
  const normal = (t) => String(t ?? "").trim().toLowerCase();
  return niveles.find((n) => normal(n.categoria) === normal(atleta.nivel)) ?? null;
}

export function codigoDia(fechaISO) {
  const { anio, mes, dia } = partesFecha(fechaISO);
  return CODIGO_DIA[new Date(anio, mes - 1, dia).getDay()];
}

export function horarioDelDia(horarios = [], fechaISO) {
  const codigo = codigoDia(fechaISO);
  return horarios.find((h) => (h.dias || []).includes(codigo)) ?? null;
}

export function textoHorario(horario) {
  return horario ? `${horario.inicio} – ${horario.fin}` : "";
}

export function idCatalogo(habilidadId) {
  const m = /^h(\d+)$/i.exec(String(habilidadId));
  return m ? `HA${m[1].padStart(3, "0")}` : String(habilidadId);
}

export function combinarHabilidades(habilidades, progreso) {
  const porHabilidad = new Map();
  for (const p of progreso) {
    const clave = idCatalogo(p.habilidadId);
    const esAntiguo = clave !== String(p.habilidadId);
    const previo = porHabilidad.get(clave);
    if (previo && !previo.esAntiguo && esAntiguo) continue;
    porHabilidad.set(clave, { completado: Boolean(p.completado), esAntiguo });
  }
  return habilidades.map((h) => ({ ...h, completado: porHabilidad.get(String(h.id))?.completado ?? false }));
}

export function resumenHabilidades(items) {
  const total = items.length;
  const completadas = items.filter((h) => h.completado).length;
  return { total, completadas, porcentaje: total ? Math.round((completadas / total) * 100) : 0 };
}


function ultimaJustificacionDeFecha(justificaciones, fechaISO) {
  let encontrada = null;
  for (const j of justificaciones) if (j.fecha === fechaISO) encontrada = j;
  return encontrada;
}

export function construirHistorial(asistencias, justificaciones) {
  const porFecha = new Map();
  for (const registro of asistencias) porFecha.set(registro.fecha, registro);

  return [...porFecha.values()]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((registro) => {
      const justificacion = ultimaJustificacionDeFecha(justificaciones, registro.fecha);
      const estado =
        registro.estado === "falta" && justificacion?.estado === "aprobada" ? "justificado" : registro.estado;
      return {
        fecha: registro.fecha,
        nivelId: registro.nivelId,
        estado,
        motivo: registro.motivo || (estado === "justificado" ? justificacion?.motivo : "") || "",
        justificacion,
      };
    });
}

export function puedeJustificar(fila) {
  return fila.estado === "falta" && !fila.justificacion;
}

export function filasDelMes(historial, anio, mesIndex) {
  const prefijo = `${anio}-${String(mesIndex + 1).padStart(2, "0")}`;
  return historial.filter((f) => f.fecha.startsWith(prefijo));
}

export function resumenAsistencia(filas) {
  const contar = (estado) => filas.filter((f) => f.estado === estado).length;
  const presentes = contar("presente");
  const inpuntuales = contar("inpuntual");
  const justificadas = contar("justificado");
  const faltas = contar("falta") + justificadas;
  const total = presentes + inpuntuales + faltas;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  return {
    total,
    presentes,
    inpuntuales,
    faltas,
    justificadas,
    asistidas: presentes + inpuntuales,
    porcentaje: pct(presentes + inpuntuales),
    porcentajePresentes: pct(presentes),
    porcentajeFaltas: pct(faltas),
  };
}

export function faltasPorJustificar(historial) {
  return historial.filter(puedeJustificar).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function agruparJustificaciones(justificaciones, hoyISO) {
  const mesActual = hoyISO.slice(0, 7);
  const ordenadas = [...justificaciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return {
    recientes: ordenadas.filter((j) => j.fecha.startsWith(mesActual)),
    anteriores: ordenadas.filter((j) => !j.fecha.startsWith(mesActual)),
  };
}

export function construirCalendario(anio, mesIndex, { historial, horarios, hoyISO }) {
  const porFecha = new Map(historial.map((f) => [f.fecha, f]));
  const totalDias = new Date(anio, mesIndex + 1, 0).getDate();
  const desfase = (new Date(anio, mesIndex, 1).getDay() + 6) % 7; 

  const celdas = [];
  for (let i = 0; i < desfase; i++) celdas.push({ tipo: "vacio", clave: `vacio-inicio-${i}` });

  for (let dia = 1; dia <= totalDias; dia++) {
    const fechaISO = aISO(new Date(anio, mesIndex, dia));
    const fila = porFecha.get(fechaISO) ?? null;
    const horario = horarioDelDia(horarios, fechaISO);
    celdas.push({
      tipo: "dia",
      clave: fechaISO,
      dia,
      fechaISO,
      fila,
      horario,
      estado: fila ? fila.estado : horario ? "programada" : "sin-sesion",
      esHoy: fechaISO === hoyISO,
      justificable: fila ? puedeJustificar(fila) : false,
    });
  }

  while (celdas.length % 7 !== 0) celdas.push({ tipo: "vacio", clave: `vacio-fin-${celdas.length}` });
  return celdas;
}

export function tituloDeDia(celda, hoyISO) {
  const horas = textoHorario(celda.horario);
  switch (celda.estado) {
    case "presente":
      return `Presente${horas ? ` · Entrenamiento ${horas}` : ""}`;
    case "inpuntual":
      return `Inpuntual${horas ? ` · Entrenamiento ${horas}` : ""}`;
    case "justificado":
      return `Justificado${celda.fila?.motivo ? ` · ${celda.fila.motivo}` : ""}`;
    case "falta": {
      if (celda.justificable) return "Falta · Clic para justificar";
      const estadoJust = celda.fila?.justificacion?.estado;
      return estadoJust ? `Falta · Justificación ${ETIQUETA_JUSTIFICACION[estadoJust].toLowerCase()}` : "Falta";
    }
    case "programada":
      return celda.fechaISO >= hoyISO
        ? `Sesión programada${horas ? ` · ${horas}` : ""}`
        : `Sesión sin registro de asistencia${horas ? ` · ${horas}` : ""}`;
    default:
      return celda.esHoy ? "Hoy" : "";
  }
}
