import { pesos } from "../../../components/utils/PagosAtleta";

function PlanMembresia({ plan, valor }) {
  return (
    <section id="infor-plan-atl">
      <h3 className="atl-titu-final">Mi plan de membresía</h3>
      <h5 className="atl-sub-final">Plan vigente actualmente</h5>
      <div className="atl-con-infor">
        <span className="atl-plan-sub">Tipo plan</span>
        <span className="atl-plan-valor">{plan ?? "—"}</span>
      </div>
      <div className="atl-con-infor">
        <span className="atl-plan-sub">Valor mensual</span>
        <span className="atl-plan-valor">{pesos(valor)}</span>
      </div>
      <div className="atl-con-infor">
        <span className="atl-plan-sub">Día de corte</span>
        <span className="atl-plan-valor">Día 30 de cada mes</span>
      </div>
    </section>
  );
}
export default PlanMembresia;