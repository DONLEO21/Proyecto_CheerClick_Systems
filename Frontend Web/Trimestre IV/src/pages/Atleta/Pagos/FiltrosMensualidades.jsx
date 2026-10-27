import { MESES } from "../../../components/utils/PagosAtleta";

const FILTROS = [
  { valor: "recientes", texto: "Últimos 3 meses" },
  { valor: "pagado", texto: "Pagados" },
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "vencido", texto: "Vencidos" },
];

function FiltrosMensualidades({ filtro, onFiltro, mes, onMes }) {
  return (
    <nav id="filtros-atl">
      <div>
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            className={filtro === f.valor ? "atl-acti" : "atl-btn-normal"}
            onClick={() => onFiltro(f.valor)}
          >
            {f.texto}
          </button>
        ))}
      </div>
      <div>
        <select id="mes-atl" value={mes} onChange={(e) => onMes(e.target.value)}>
          <option value="">📆 Mes</option>
          {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </nav>
  );
}
export default FiltrosMensualidades;