import {
  PersonStanding,
  Trophy,
  Footprints,
  Shirt,
  MessageSquareDot,
} from "lucide-react";

// Ruta real de la pantalla de cuentas (App.jsx)
export const RUTA_CUENTAS = "/admin/usuarios";

// Rutas de las pantallas externas
export const RUTA_HORARIOS = "horarios.html";
export const RUTA_NOVEDADES = "novedades.html";
export const RUTA_PAGOS = "Gestion_Pagos_admi.html";

// Máximo de elementos visibles por tarjeta en el dashboard
export const MAX_ITEMS = 3;

/* ───────── datos de ejemplo (pagos, actividades y novedades) ───────── */

// "cantidad" = número de cuentas en cada estado; los porcentajes se calculan solos
export const PAGOS_STATS = [
  { id: "pagado", nombre: "Pagado", cantidad: 13, color: "#d71920" },
  { id: "pendiente", nombre: "Pendiente", cantidad: 5, color: "#c9c9c9" },
  { id: "vencido", nombre: "Vencido", cantidad: 3, color: "#4d4d4d" },
];

const ACTIVIDADES = [
  {
    id: 1,
    icono: PersonStanding,
    variante: "amarillo",
    titulo: "Competencia regional - UNIVERSAL",
    fecha: "25 de julio del 2026",
    fechaOrden: "2026-07-25", // AAAA-MM-DD (fecha de inicio)
  },
  {
    id: 2,
    icono: Trophy,
    variante: null,
    titulo: "Competencia regional - INFINITY LEAGUE",
    fecha: "20 de septiembre del 2026",
    fechaOrden: "2026-09-20",
  },
  {
    id: 3,
    icono: Trophy,
    variante: "alerta",
    titulo: "Competencia nacional - CONTINENTAL",
    fecha: "25 - 27 de septiembre del 2026",
    fechaOrden: "2026-09-25",
  },
];

const NOVEDADES = [
  {
    id: 1,
    icono: Footprints,
    titulo: "Clases de entrenamiento programadas",
    detalle: "27 de marzo del 2026 · 6:00 PM",
    fechaOrden: "2026-03-27",
  },
  {
    id: 2,
    icono: Shirt,
    titulo: "Nuevo implemento deportivo solicitado",
    detalle: "16 de mayo del 2026 · Camiseta deportiva",
    fechaOrden: "2026-05-16",
  },
  {
    id: 3,
    icono: MessageSquareDot,
    titulo: "Nueva PQRS registrada",
    detalle: "Leonardo Jara · Atleta",
    fechaOrden: "2026-09-19",
  },
];

// Campeonatos: el más cercano primero. Al conectar con Horarios, filtra también fechaOrden >= hoy.
export const ACTIVIDADES_ORDENADAS = [...ACTIVIDADES].sort((a, b) =>
  a.fechaOrden.localeCompare(b.fechaOrden),
);

// Novedades: la más reciente primero.
export const NOVEDADES_ORDENADAS = [...NOVEDADES].sort((a, b) =>
  b.fechaOrden.localeCompare(a.fechaOrden),
);