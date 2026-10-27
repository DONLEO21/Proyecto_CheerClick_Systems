const API_URL = "http://localhost:3001/resenasComunidad";

export async function getResenas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("No se pudieron cargar las reseñas.");
  return res.json();
}

export async function crearResena(datos) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo enviar la reseña.");
  return res.json();
}