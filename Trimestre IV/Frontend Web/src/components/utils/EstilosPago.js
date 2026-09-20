export function obtenerEstiloPlan(plan) {
  switch (plan?.toLowerCase().trim()) {
    case "básico":
      return { backgroundColor: "#fef3c7", color: "#f59e0b" };
    case "white":
      return { backgroundColor: "#dbeafe", color: "#2f80ed" };
    case "black":
      return { backgroundColor: "#fdeaea", color: "#d71920" };
    default:
      return { backgroundColor: "#dce5f8", color: "#6b7280" };
  }
}

export function obtenerEstiloEstadoPago(estado) {
  switch (estado) {
    case "pagado":
    case "validado":
      return { backgroundColor: "#e6f9ee", color: "#1eaf52", texto: "Pagado" };
    case "porValidar":
      return { backgroundColor: "#e6f9ee", color: "#1eaf52", texto: "Por validar" };
    case "vencido":
      return { backgroundColor: "#fdeaea", color: "#d71920", texto: "Vencido" };
    default:
      return { backgroundColor: "#dce5f8", color: "#6b7280", texto: "Pendiente" };
  }
}

