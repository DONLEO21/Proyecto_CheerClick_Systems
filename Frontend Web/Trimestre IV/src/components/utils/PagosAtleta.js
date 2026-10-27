export const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export const pesos = (n) =>
  (n ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

// Ordena mensualidades de más reciente a más antigua usando el nombre del mes.
export const ordenarPorMes = (lista) =>
  [...lista].sort((a, b) => MESES.indexOf(b.mes) - MESES.indexOf(a.mes));

export const ESTADOS = {
  pagado:    { clase: "esta-paga", texto: "Pagado" },
  pendiente: { clase: "esta-pen",  texto: "Pendiente" },
  vencido:   { clase: "esta-ven",  texto: "Vencido" },
};

export function calcularResumen(mensualidades) {
  const pendientes = mensualidades.filter((m) => m.estado !== "pagado");
  const pagadas = mensualidades.filter((m) => m.estado === "pagado");
  const proxima = ordenarPorMes(pendientes).at(-1);

  return {
    totalPendiente: pendientes.reduce((s, m) => s + m.valor, 0),
    totalPagado: pagadas.reduce((s, m) => s + m.valor, 0),
    mesesAlDia: `${pagadas.length} / ${mensualidades.length}`,
    proximoVencimiento: proxima ? proxima.mes : "Al día",
  };
}

// Notificaciones derivadas de las mensualidades (no hay colección propia).
export function construirNotificaciones(mensualidades) {
  return ordenarPorMes(mensualidades).slice(0, 4).map((m) => {
    if (m.estado === "pagado")
      return { id: m.id, tipo: "ok", texto: `${m.mes} pago registrado exitosamente`, fecha: m.fechaPago ?? "" };
    if (m.estado === "vencido")
      return { id: m.id, tipo: "alerta", texto: `${m.mes} se encuentra vencido.`, fecha: m.generacion };
    return { id: m.id, tipo: "aviso", texto: `${m.mes} está pendiente. Recuerda pagar.`, fecha: m.generacion };
  });
}