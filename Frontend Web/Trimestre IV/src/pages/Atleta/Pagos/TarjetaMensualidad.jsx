import { pesos, ESTADOS } from "../../../components/utils/PagosAtleta";

const CLASE_ESTADO = {
  pagado: "atl-esta-paga",
  pendiente: "atl-esta-pen",
  vencido: "atl-esta-ven",
};

function TarjetaMensualidad({ mensualidad, onSubir, onVer }) {
  const estado = ESTADOS[mensualidad.estado] ?? ESTADOS.pendiente;
  const claseEstado = CLASE_ESTADO[mensualidad.estado] ?? CLASE_ESTADO.pendiente;
  const tieneComprobante = !!mensualidad.comprobante;

  return (
    <div className="atl-tar-infor">
      <h4 className="atl-tar-titulo">{mensualidad.mes}</h4>
      <button type="button" className={claseEstado}>{estado.texto}</button>
      <h3 className="atl-tar-precio">{pesos(mensualidad.valor)}</h3>
      <p className="atl-tar-fecha">
        {mensualidad.estado === "pagado"
          ? `Pagado: ${mensualidad.fechaPago ?? "—"} · ${mensualidad.metodo ?? ""}`
          : tieneComprobante
            ? "Comprobante enviado · en revisión"
            : `Generado: ${mensualidad.generacion}`}
      </p>

      {tieneComprobante ? (
        <button type="button" className="atl-ver-compro" onClick={() => onVer(mensualidad)}>
          <svg className="atl-sim-compro" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ver comprobante
        </button>
      ) : (
        <button type="button" className="atl-subir-compro" onClick={() => onSubir(mensualidad)}>
          <svg className="atl-sim-compro" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V3" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5 5 5-5" />
          </svg>
          Subir comprobante
        </button>
      )}
    </div>
  );
}
export default TarjetaMensualidad;