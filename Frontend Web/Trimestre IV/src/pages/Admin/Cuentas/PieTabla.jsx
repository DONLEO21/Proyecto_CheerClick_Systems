import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FILAS_POR_PAGINA } from './cuentasData.js'

export default function PieTabla({ p, onCambiar }) {
  if (p.total <= FILAS_POR_PAGINA) return null
  return (
    <footer className="cuentas-pie">
      <span>Mostrando {p.inicio + 1}–{p.inicio + p.visibles.length} de {p.total}</span>
      <div className="cuentas-paginador" role="group" aria-label="paginación de la tabla">
        <button type="button" aria-label="Página anterior"
          disabled={p.actual === 1} onClick={() => onCambiar(p.actual - 1)}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <span className="cuentas-paginador__indicador">{p.actual} / {p.totalPaginas}</span>
        <button type="button" aria-label="Página siguiente"
          disabled={p.actual >= p.totalPaginas} onClick={() => onCambiar(p.actual + 1)}>
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </footer>
  )
}