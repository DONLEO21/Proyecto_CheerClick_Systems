// src/pages/Entrenador/calendarioData.js
// Constantes y funciones auxiliares del calendario de entrenamientos.
//
// Modelo de "horarios" de un nivel (IMPORTANTE):
// nivel.horarios = [ { dias: ['lun','mie','jue'], inicio: '18:00', fin: '20:00' },
//                     { dias: ['sab'],            inicio: '12:00', fin: '14:00' } ]
// Cada bloque tiene SUS PROPIOS días — así un nivel puede entrenar unos días
// a una hora y otro día distinto a otra hora, sin mezclarlos.

export const MESES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DIAS_ES = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

export const TIPOS_BASE = ["Partner", "Gimnasia", "Baile"];

// Mapea las claves de días usadas en los niveles a números de getDay()
const CLAVE_A_NUMERO = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 };

// Convierte ['lun','mie','sab'] -> [1, 3, 6]
export function diasANumeros(dias = []) {
  return dias.map((d) => CLAVE_A_NUMERO[d]).filter((n) => n !== undefined);
}

// Todos los días (número 0-6) en los que el nivel entrena, sin importar
// a cuál bloque de horario pertenezcan. Se usa para pintar el calendario.
export function todosLosDiasDelNivel(nivel) {
  const bloques = nivel?.horarios || [];
  const set = new Set();
  bloques.forEach((b) => diasANumeros(b.dias).forEach((n) => set.add(n)));
  return [...set];
}

// Encuentra el bloque de horario cuyo grupo de días incluye ese día de la
// semana (0-6). Si el nivel entrena distinto un sábado, este es el que lo
// encuentra en vez de asumir siempre el primer horario de la lista.
export function bloqueParaDiaSemana(nivel, numeroDia) {
  const bloques = nivel?.horarios || [];
  return bloques.find((b) => diasANumeros(b.dias).includes(numeroDia)) || null;
}

// ¿Ese día de ese mes es día de entrenamiento? (según la unión de todos los bloques)
export function esDiaEntrenamiento(anio, mes, dia, diasEntrenamiento) {
  return diasEntrenamiento.includes(new Date(anio, mes, dia).getDay());
}

// Fecha ISO "2026-04-22" para usar como clave de sesión
export function claveFecha(anio, mes, dia) {
  const m = String(mes + 1).padStart(2, "0");
  const d = String(dia).padStart(2, "0");
  return `${anio}-${m}-${d}`;
}

// "18:00" -> "6:00 p.m."
export function a12h(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "p.m." : "a.m.";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatearRangoHora(inicio, fin) {
  return `${a12h(inicio)} – ${a12h(fin)}`;
}

// "Miércoles, 22 de abril"
export function etiquetaFechaLarga(anio, mes, dia) {
  const nombreDia = DIAS_ES[new Date(anio, mes, dia).getDay()];
  const capital = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
  return `${capital}, ${dia} de ${MESES_ES[mes].toLowerCase()}`;
}

// Cuántos días de entrenamiento tiene el mes
export function contarDiasEntrenamiento(anio, mes, diasEntrenamiento) {
  const total = new Date(anio, mes + 1, 0).getDate();
  let n = 0;
  for (let d = 1; d <= total; d++) {
    if (esDiaEntrenamiento(anio, mes, d, diasEntrenamiento)) n++;
  }
  return n;
}

// Construye la matriz de celdas del mes (con huecos al inicio)
export function celdasDelMes(anio, mes) {
  const primerDiaSemana = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);
  return celdas;
}

export function esHoy(anio, mes, dia) {
  const h = new Date();
  return h.getFullYear() === anio && h.getMonth() === mes && h.getDate() === dia;
}

// Sesión vacía por defecto para un día que aún no existe en la API.
// Usa el bloque de horario que corresponde a ESE día de la semana
// (no siempre el primero de la lista, porque puede haber días con horas distintas).
export function sesionPorDefecto(nivel, fecha, numeroDiaSemana) {
  const bloque = bloqueParaDiaSemana(nivel, numeroDiaSemana);
  return {
    id: null,
    nivelId: nivel?.id ?? null,
    fecha,
    horaInicio: bloque?.inicio || "18:00",
    horaFin: bloque?.fin || "20:00",
    enfoque: "",
    lugar: "",
    notas: "",
    estado: "activa",
    tipos: [],
    asistenciaMarcada: false,
  };
}
