// src/pages/Atleta/PQRS/pqrsData.js
// Catálogos y utilidades de la vista del atleta.

export const TIPOS = [
  { valor: "peticion", etiqueta: "Petición" },
  { valor: "queja", etiqueta: "Queja" },
  { valor: "reclamo", etiqueta: "Reclamo" },
  { valor: "sugerencia", etiqueta: "Sugerencia" },
];

// Cómo ve el atleta cada estado que maneja el administrador
export const ESTADOS = {
  pendiente: {
    etiqueta: "Pendiente",
    icono: "bi-flag",
    iconoInsignia: "bi-flag",
    asignacion: "Aún no ha sido asignada a un responsable.",
  },
  tramite: {
    etiqueta: "En trámite",
    icono: "bi-clock",
    iconoInsignia: "bi-clock",
    asignacion: "En revisión por el equipo administrativo.",
  },
  resuelto: {
    etiqueta: "Resuelta",
    icono: "bi-check-circle",
    iconoInsignia: "bi-check-lg",
    asignacion: "Solicitud resuelta por el equipo administrativo.",
  },
};

export const PESTANAS = [
  { valor: "todas", etiqueta: "TODAS" },
  { valor: "pendiente", etiqueta: "PENDIENTES" },
  { valor: "tramite", etiqueta: "EN TRÁMITE" },
  { valor: "resuelto", etiqueta: "RESUELTAS" },
];

export const ESTADO_INICIAL_FORM = {
  tipo: "",
  asunto: "",
  descripcion: "",
  evidencia: "", // nombre del archivo ya guardado
  archivo: null, // archivo recién seleccionado
};

// Evidencia adjunta: PDF, JPG o PNG, máx. 5 MB
export const TIPOS_ARCHIVO = ["application/pdf", "image/jpeg", "image/png"];
export const TAMANO_MAX_ARCHIVO = 5 * 1024 * 1024;

// El radicado es el número que ve la gente (PQ0007). json-server v1 asigna su propio
// `id` interno al crear, por eso los registros nuevos guardan el número en `radicado`.
export const radicadoDe = (pqrs) => pqrs.radicado ?? pqrs.id;

export const etiquetaTipo = (valor) =>
  TIPOS.find((t) => t.valor === valor)?.etiqueta ?? valor;

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// "2026-06-10" → "10 jun 2026" (sin pasar por Date para evitar desfases de zona horaria)
export const formatearFecha = (iso) => {
  if (!iso) return "";
  const [anio, mes, dia] = iso.split("-");
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${anio}`;
};

// Fecha de hoy en formato ISO (AAAA-MM-DD), en hora local
export const fechaHoy = () => {
  const h = new Date();
  const dos = (n) => String(n).padStart(2, "0");
  return `${h.getFullYear()}-${dos(h.getMonth() + 1)}-${dos(h.getDate())}`;
};
