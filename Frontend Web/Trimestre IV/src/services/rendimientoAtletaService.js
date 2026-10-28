import { formatearTamano, horarioDelDia, mismoId, resolverNivel } from "./rendimientoCalculos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ErrorNoEncontrado extends Error {}

async function pedir(ruta, opciones) {
  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, { cache: "no-store", ...opciones });
  } catch {
    throw new Error("No se pudo conectar con el servidor de datos. Verifica que json-server esté corriendo.");
  }
  if (res.status === 404) throw new ErrorNoEncontrado("No se encontró la información del atleta.");
  if (!res.ok) throw new Error(`Error de red al hablar con json-server (${res.status})`);
  return res.json();
}

export async function obtenerDatosRendimiento(atletaId) {
  const [atleta, habilidades, progreso, notas, asistencias, justificaciones, atletasAsistencia, niveles] =
    await Promise.all([
      pedir(`/atletas/${encodeURIComponent(atletaId)}`),
      pedir("/habilidades"),
      pedir("/progresoHabilidades"),
      pedir("/notas"),
      pedir("/asistencias"),
      pedir("/justificaciones"),
      pedir("/atletasAsistencia"),
      pedir("/niveles"),
    ]);

  const delAtleta = (lista) => lista.filter((x) => mismoId(x.atletaId, atleta.id));
  const nivel = resolverNivel(atleta, atletasAsistencia, niveles) ?? {
    id: null,
    categoria: atleta.nivel,
    entrenador: "",
    horarios: [],
  };

  return {
    atleta,
    nivel,
    habilidades,
    progreso: delAtleta(progreso),
    notas: delAtleta(notas),
    asistencias: delAtleta(asistencias),
    justificaciones: delAtleta(justificaciones),
  };
}

const comoEnSemilla = (id) => (/^\d+$/.test(String(id)) ? Number(id) : id);

export async function enviarJustificacion({ atleta, nivel, nivelId, fechaISO, motivo, archivo }) {
  const todas = await pedir("/justificaciones");
  const yaEnviada = todas.some((j) => mismoId(j.atletaId, atleta.id) && j.fecha === fechaISO);
  if (yaEnviada) throw new Error("Ya enviaste una justificación para esta fecha.");

  const horario = horarioDelDia(nivel.horarios, fechaISO);
  return pedir("/justificaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      atletaId: comoEnSemilla(atleta.id),
      nivelId: comoEnSemilla(nivelId ?? nivel.id),
      fecha: fechaISO,
      horaInicio: horario?.inicio ?? "",
      horaFin: horario?.fin ?? "",
      motivo: motivo.trim(),
      archivoNombre: archivo?.name ?? "",
      archivoTamano: archivo ? formatearTamano(archivo.size) : "",
      estado: "pendiente",
      observacion: "",
      fechaRevision: "",
    }),
  });
}
