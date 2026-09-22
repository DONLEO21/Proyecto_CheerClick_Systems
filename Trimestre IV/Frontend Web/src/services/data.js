const DIA_SEMANA_A_NUMERO = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 };
const LETRA_POR_DIA = ["D", "L", "M", "X", "J", "V", "S"]; 

const NOMBRES_MES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function hoy() {
  return new Date();
}

export function aISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function fechaHoyISO() {
  return aISO(hoy());
}

export function formatearFechaCorta(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function formatearFechaLarga(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  return `${dia} de ${NOMBRES_MES[mes - 1].toLowerCase()} del ${anio}`;
}

export function nombreMes(mesIndex) {
  return NOMBRES_MES[mesIndex];
}

export function diasEnMes(anio, mesIndex) {
  return new Date(anio, mesIndex + 1, 0).getDate();
}

// "Nivel 3 Magic" -> "Magic" | "Nivel Formativo King" se deja igual
// porque no tiene un número de nivel que recortar.
export function nombreCortoNivel(categoria = "") {
  return categoria.replace(/^Nivel\s+\d+\s+/i, "").trim() || categoria;
}

export function iniciales(nombre = "", apellido = "") {
  const palabras = `${nombre} ${apellido}`.trim().split(/\s+/);
  return palabras.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function horarioDiasUnicos(horarios = []) {
  const set = new Set();
  horarios.forEach((h) => (h.dias || []).forEach((d) => set.add(d)));
  return Array.from(set);
}

export function diasDeSesion(anio, mesIndex, diasHorario = []) {
  const numerosPermitidos = new Set(
    diasHorario.map((d) => DIA_SEMANA_A_NUMERO[d]).filter((n) => n !== undefined)
  );
  const totalDias = diasEnMes(anio, mesIndex);
  const dias = [];
  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = new Date(anio, mesIndex, dia);
    const diaSemana = fecha.getDay();
    if (numerosPermitidos.size === 0 || numerosPermitidos.has(diaSemana)) {
      dias.push({ dia, letra: LETRA_POR_DIA[diaSemana], fechaISO: aISO(fecha) });
    }
  }
  return dias;
}
