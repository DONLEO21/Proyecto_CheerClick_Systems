const BASE = "http://localhost:3001";

async function pedir(ruta, opciones = {}) {
  const res = await fetch(`${BASE}/${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} en /${ruta}`);
  return res.json();
}

export const api = {
  listar: (recurso) => pedir(recurso),
  obtener: (recurso, id) => pedir(`${recurso}/${id}`),
  crear: (recurso, datos) =>
    pedir(recurso, { method: "POST", body: JSON.stringify(datos) }),
  actualizar: (recurso, id, cambios) =>
    pedir(`${recurso}/${id}`, { method: "PATCH", body: JSON.stringify(cambios) }),
};