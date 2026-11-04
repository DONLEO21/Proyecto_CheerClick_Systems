
export const TALLAS_POR_GRUPO = {
  Ninas: ["4", "6", "8", "10", "12", "14"],
  Adolescentes: ["XS", "S", "M", "L", "XL"],
  Calzado: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"],
  Unica: ["Única"], 
};

export const GRUPOS_POR_CATEGORIA = {
  Ropa: ["Ninas", "Adolescentes"],
  Calzado: ["Calzado"],
  Accesorios: ["Unica"],
};

export const GRUPOS_TALLA = Object.keys(TALLAS_POR_GRUPO);

// Valida que la talla pertenezca al grupo indicado.
export function tallaValidaParaGrupo(talla) {
  const grupo = typeof this.get === "function" ? this.get("grupo") : this.grupo;
  if (!grupo) return true; 
  return (TALLAS_POR_GRUPO[grupo] ?? []).includes(talla);
}