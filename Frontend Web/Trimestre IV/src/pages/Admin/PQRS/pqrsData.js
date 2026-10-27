
export const TIPOS = [
  { valor: "peticion", etiqueta: "Petición" },
  { valor: "queja", etiqueta: "Queja" },
  { valor: "reclamo", etiqueta: "Reclamo" },
  { valor: "sugerencia", etiqueta: "Sugerencia" },
];

export const ESTADOS = [
  { valor: "pendiente", etiqueta: "Pendiente" },
  { valor: "tramite", etiqueta: "En trámite" },
  { valor: "resuelto", etiqueta: "Resuelto" },
];

export const PRIORIDADES = [
  { valor: "alta", etiqueta: "Alta" },
  { valor: "media", etiqueta: "Media" },
  { valor: "baja", etiqueta: "Baja" },
];

export const FILTROS_INICIALES = {
  orden: "",
  tipo: "",
  estado: "",
  prioridad: "",
  busqueda: "",
};

export const radicadoDe = (pqrs) => pqrs.radicado ?? pqrs.id;

export const etiquetaDe = (lista, valor) =>
  lista.find((item) => item.valor === valor)?.etiqueta ?? valor;
