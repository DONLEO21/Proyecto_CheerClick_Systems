// Catalogo de tallas por grupo.
export const TALLAS_POR_GRUPO = {
  Ninas: ["4", "6", "8", "10", "12", "14"],
  Adolescentes: ["XS", "S", "M", "L", "XL"],
  Calzado: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"],
  Unica: ["Única"], // accesorios sin talla
};

// Nombre que se muestra en pantalla para cada grupo
export const ETIQUETA_GRUPO = {
  Ninas: "Niñas",
  Adolescentes: "Adolescentes",
  Calzado: "Calzado",
  Unica: "Talla única",
};

// Qué grupos de talla acepta cada tipo de implemento
export const GRUPOS_POR_TIPO = {
  Ropa: ["Ninas", "Adolescentes"],
  Calzado: ["Calzado"],
  Accesorios: ["Unica"],
};

export const gruposDeTipo = (tipo) => GRUPOS_POR_TIPO[tipo] ?? [];

// Suma el stock de todas las tallas
export const totalStock = (tallas = []) =>
  tallas.reduce((suma, t) => suma + (Number(t.stock) || 0), 0);

// Ordena las tallas según el orden del catálogo
const ORDEN_GRUPOS = Object.keys(TALLAS_POR_GRUPO);

export const ordenarTallas = (tallas = []) =>
  [...tallas].sort((a, b) => {
    const porGrupo = ORDEN_GRUPOS.indexOf(a.grupo) - ORDEN_GRUPOS.indexOf(b.grupo);
    if (porGrupo !== 0) return porGrupo;
    const lista = TALLAS_POR_GRUPO[a.grupo] ?? [];
    return lista.indexOf(a.talla) - lista.indexOf(b.talla);
  });

// Devuelve [{ grupo, items: [{ grupo, talla, stock }] }] ordenado
export const agruparTallas = (tallas = []) => {
  const mapa = new Map();
  ordenarTallas(tallas).forEach((t) => {
    if (!mapa.has(t.grupo)) mapa.set(t.grupo, []);
    mapa.get(t.grupo).push(t);
  });
  return [...mapa].map(([grupo, items]) => ({ grupo, items }));
};

// Texto de la talla de una solicitud: "M (Adolescentes)", "36", "Única"
export const etiquetaTalla = (solicitud) => {
  const grupo = solicitud.grupoTalla;
  if (!grupo || grupo === "Unica") return solicitud.talla;
  return `${solicitud.talla} (${ETIQUETA_GRUPO[grupo] ?? grupo})`;
};