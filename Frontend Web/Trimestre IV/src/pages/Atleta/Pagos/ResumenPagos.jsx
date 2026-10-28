import { pesos } from "../../../components/utils/PagosAtleta";

function ResumenPagos({ resumen }) {
  return (
    <section id="infor-general-atl">
      <div className="atl-tar-general">
        <h3 className="atl-gene-titu">Total pendiente</h3>
        <h2 id="titu-pendi-atl">{pesos(resumen.totalPendiente)}</h2>
      </div>
      <div className="atl-tar-general">
        <h3 className="atl-gene-titu">Pagado este año</h3>
        <h2 id="titu-paga-atl">{pesos(resumen.totalPagado)}</h2>
      </div>
      <div className="atl-tar-general">
        <h3 className="atl-gene-titu">Meses al día</h3>
        <h2 id="titu-meses-atl">{resumen.mesesAlDia}</h2>
      </div>
      <div className="atl-tar-general">
        <h3 className="atl-gene-titu">Próximo vencimiento</h3>
        <h2 id="titu-fecha-atl">{resumen.proximoVencimiento}</h2>
      </div>
    </section>
  );
}
export default ResumenPagos;