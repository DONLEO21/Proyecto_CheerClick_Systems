const API_URL = "http://localhost:3001/implementos";

export async function getImplementos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("No se pudieron cargar los implementos.");
  return res.json();
}

export async function crearImplemento(datos) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo crear el implemento.");
  return res.json();
}

export async function actualizarImplemento(id, datos) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el implemento.");
  return res.json();
}

export async function cambiarEstadoImplemento(implemento, nuevoEstado) {
  return actualizarImplemento(implemento.id, { ...implemento, estado: nuevoEstado });
}