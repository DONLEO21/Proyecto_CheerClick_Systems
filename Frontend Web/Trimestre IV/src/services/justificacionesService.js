const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function manejarRespuesta(res) {
  if (!res.ok) {
    throw new Error(`Error de red al hablar con json-server (${res.status})`);
  }
  return res.json();
}

// Trae todas las justificaciones. El filtrado por nivel(es) se hace en el
// cliente porque json-server no soporta "in" de forma nativa en todas las
// versiones; con el volumen de datos de este proyecto es suficiente.
export async function obtenerJustificaciones() {
  const res = await fetch(`${API_URL}/justificaciones`);
  return manejarRespuesta(res);
}

export async function actualizarJustificacion(id, cambios) {
  const res = await fetch(`${API_URL}/justificaciones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  return manejarRespuesta(res);
}

export function contarPorEstado(justificaciones) {
  return {
    pendientes: justificaciones.filter((j) => j.estado === "pendiente").length,
    aprobadas: justificaciones.filter((j) => j.estado === "aprobada").length,
    rechazadas: justificaciones.filter((j) => j.estado === "rechazada").length,
    todas: justificaciones.length,
  };
}
