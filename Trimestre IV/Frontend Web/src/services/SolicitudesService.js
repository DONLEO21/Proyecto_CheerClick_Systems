const API_URL = "http://localhost:3001/solicitudes";

export async function getSolicitudes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("No se pudieron cargar las solicitudes.");
  return res.json();
}

export async function crearSolicitud(datos) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: `SL${Math.floor(Math.random() * 900 + 100)}`,
      estado: "Pendiente",
      motivoRechazo: "",
      ...datos,
    }),
  });
  if (!res.ok) throw new Error("No se pudo enviar la solicitud.");
  return res.json();
}

export async function cancelarSolicitud(solicitud) {
  return actualizarSolicitud(solicitud.id, { ...solicitud, estado: "Cancelado" });
}

export async function actualizarSolicitud(id, datos) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la solicitud.");
  return res.json();
}

export async function marcarRecibido(solicitud) {
  return actualizarSolicitud(solicitud.id, { ...solicitud, recibido: true });
}

export async function aprobarSolicitud(solicitud) {
  const res = await fetch(`${API_URL}/${solicitud.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...solicitud, estado: "Aprobado", motivoRechazo: "" }),
  });
  if (!res.ok) throw new Error("No se pudo aprobar la solicitud.");
  return res.json();
}

export async function rechazarSolicitud(solicitud, motivo) {
  const res = await fetch(`${API_URL}/${solicitud.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...solicitud, estado: "Rechazado", motivoRechazo: motivo }),
  });
  if (!res.ok) throw new Error("No se pudo rechazar la solicitud.");
  return res.json();
}