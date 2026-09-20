
export function obtenerClaseNivelHabilidad(nivel) {
  const texto = nivel?.toLowerCase().trim() || "";

  if (texto.includes("1")) return "btn-nivel";
  if (texto.includes("4")) return "btn-nivel";
  return "btn-nivel"; 
  
}

export function obtenerClaseTipoHabilidad(categoria) {
  switch (categoria?.toLowerCase().trim()) {
    case "apropiada":
      return "btn-apro";
    case "avanzada":
      return "btn-ava";
    case "elite":
      return "btn-eli";
    default:
      return "btn-apro";
  }
}

export function etiquetaTipoHabilidad(categoria) {
  switch (categoria?.toLowerCase().trim()) {
    case "apropiada":
      return "Apropiada";
    case "avanzada":
      return "Avanzada";
    case "elite":
      return "Élite";
    default:
      return categoria;
  }
}