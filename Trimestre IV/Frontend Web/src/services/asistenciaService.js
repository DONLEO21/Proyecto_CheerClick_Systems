const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function manejarRespuesta(res) {
  if (!res.ok) {
    throw new Error(`Error de red al hablar con json-server (${res.status})`);
  }
  return res.json();
}

export async function obtenerNiveles() {
  const res = await fetch(`${API_URL}/niveles`);
  return manejarRespuesta(res);
}

export async function obtenerAtletasPorNivel(nivelId) {
  const res = await fetch(`${API_URL}/atletasAsistencia?nivelId=${encodeURIComponent(nivelId)}`);
  return manejarRespuesta(res);
}

export async function obtenerRegistrosDia(nivelId, fechaISO) {
  const res = await fetch(
    `${API_URL}/asistencias?nivelId=${encodeURIComponent(nivelId)}&fecha=${fechaISO}`
  );
  return manejarRespuesta(res);
}

export async function obtenerRegistrosRango(nivelId, fechaInicioISO, fechaFinISO) {
  const res = await fetch(
    `${API_URL}/asistencias?nivelId=${encodeURIComponent(nivelId)}` +
      `&fecha_gte=${fechaInicioISO}&fecha_lte=${fechaFinISO}`
  );
  return manejarRespuesta(res);
}

async function guardarRegistroAtleta({ id, atletaId, nivelId, fecha, estado, motivo }) {
  const cuerpo = { atletaId, nivelId: Number(nivelId), fecha, estado, motivo: motivo ?? "" };
  const url = id ? `${API_URL}/asistencias/${id}` : `${API_URL}/asistencias`;
  const res = await fetch(url, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  return manejarRespuesta(res);
}

export async function guardarAsistenciaDia(nivelId, fechaISO, registros) {
  const existentes = await obtenerRegistrosDia(nivelId, fechaISO);
  const existentePorAtleta = new Map(existentes.map((r) => [String(r.atletaId), r]));

  return Promise.all(
    registros.map(({ atletaId, estado, motivo }) => {
      const previo = existentePorAtleta.get(String(atletaId));
      return guardarRegistroAtleta({
        id: previo?.id,
        atletaId,
        nivelId,
        fecha: fechaISO,
        estado,
        motivo,
      });
    })
  );
}

export async function marcarAsistenciaComoJustificada(nivelId, fecha, atletaId, motivo) {
  const existentes = await obtenerRegistrosDia(nivelId, fecha);
  const previo = existentes.find((r) => String(r.atletaId) === String(atletaId));
  return guardarRegistroAtleta({
    id: previo?.id,
    atletaId,
    nivelId,
    fecha,
    estado: "justificado",
    motivo,
  });
}

export function calcularResumen(registros) {
  return {
    presentes: registros.filter((r) => r.estado === "presente").length,
    inpuntuales: registros.filter((r) => r.estado === "inpuntual").length,
    faltas: registros.filter((r) => r.estado === "falta").length,
    justificadas: registros.filter((r) => r.estado === "justificado").length,
  };
}
