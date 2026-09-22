
export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
export const DIAS_NOMBRE = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const DIAS_ABREV = ["L", "M", "X", "J", "V", "S", "D"];

export const CATEGORIAS = {
  partner: { nombre: "Partner", icono: "bi-people", clase: "cat-partner" },
  gimnasia: { nombre: "Gimnasia", icono: "bi-person-arms-up", clase: "cat-gimnasia" },
  baile: { nombre: "Baile", icono: "bi-music-note-beamed", clase: "cat-baile" },
  campeonato: { nombre: "Campeonato", icono: "bi-trophy", clase: "cat-campeonato" },
};

export const FILTROS_LISTA = ["todos", "partner", "gimnasia", "baile", "campeonato"];

export function fechaAISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
export function parsearFecha(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function mismaFecha(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function obtenerLunesDeSemana(fecha) {
  const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const dia = d.getDay(); // 0=Dom, 1=Lun...
  const diff = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + diff);
  return d;
}

export function formatearRangoSemana(lunes) {
  const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6);
  const dL = lunes.getDate(), mL = MESES[lunes.getMonth()], aL = lunes.getFullYear();
  const dD = domingo.getDate(), mD = MESES[domingo.getMonth()], aD = domingo.getFullYear();
  if (aL !== aD) return `${dL} de ${mL} ${aL} – ${dD} de ${mD} ${aD}`;
  if (lunes.getMonth() !== domingo.getMonth()) return `${dL} de ${mL} – ${dD} de ${mD}, ${aL}`;
  return `${dL} – ${dD} de ${mL}, ${aL}`;
}

export function formatearFechaLarga(iso) {
  const d = parsearFecha(iso);
  const i = d.getDay() === 0 ? 6 : d.getDay() - 1; // 0=Lun ... 6=Dom
  return `${DIAS_NOMBRE[i]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export function formatearFechaCorta(iso) {
  const d = parsearFecha(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export function obtenerInsignia(iso, hoy) {
  const f = parsearFecha(iso);
  const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (mismaFecha(f, h)) return "HOY";
  if (f < h) return "PASADO";
  return "PRÓXIMO";
}

export function esPasada(iso, hoy) {
  const f = parsearFecha(iso);
  const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return f < h;
}

export function a12h(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function obtenerIniciales(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function formatearMoneda(valor) {
  const num = Number(valor) || 0;
  return "$" + num.toLocaleString("es-CO");
}
