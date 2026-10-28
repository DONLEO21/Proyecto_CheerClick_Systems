export function obtenerEstiloNivel(nivel) {
  switch (nivel?.toLowerCase().trim()) {
    case "nivel formativo king":
      return { backgroundColor: "#dbeafe", color: "#2f80ed" };
    case "nivel 3 magic":
      return { backgroundColor: "#e7ceff", color: "#a318ff" };
    case "nivel 1 princess":
      return { backgroundColor: "#fcd1e5", color: "#fc4e4e" };
    case "nivel 4 blood tigers":
      return { backgroundColor: "#fae9b8", color: "#fa9230" };
    case "nivel 1 queen":
      return { backgroundColor: "#faa9b1", color: "#ff1414" };
    default:
      return { backgroundColor: "#495057", color: "#ffffff" };
  }
}