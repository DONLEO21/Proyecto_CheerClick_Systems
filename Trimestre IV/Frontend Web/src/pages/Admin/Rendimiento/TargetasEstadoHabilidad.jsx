function TargetasEstadoHabilidad({ habilidades }) {
  const contarPorCategoria = (categoria) =>
    habilidades.filter(
      (h) => h.categoria === categoria && h.estado !== "inhabilitada"
    ).length;

  const contarInhabilitadas = () =>
    habilidades.filter((h) => h.estado === "inhabilitada").length;

  return (
    <section id="targetas-h" className="container">
      <div className="row g-3">
        <div className="col-md-3">
          <div className="targe-ren-h">
            <div id="detalle-cir-azul"></div>
            <h3 id="valor-targe">{contarPorCategoria("apropiada")}</h3>
            <h4 className="titu-targe">Apropiadas</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="targe-ren-h">
            <div id="detalle-cir-rojo"></div>
            <h3 id="valor-targe">{contarPorCategoria("avanzada")}</h3>
            <h4 className="titu-targe">Avanzadas</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="targe-ren-h">
            <div id="detalle-cir-ama"></div>
            <h3 id="valor-targe">{contarPorCategoria("elite")}</h3>
            <h4 className="titu-targe">Élite</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="targe-ren-h">
            <div id="detalle-cir-gris"></div>
            <h3 id="valor-targe">{contarInhabilitadas()}</h3>
            <h4 className="titu-targe">Inhabilitadas</h4>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TargetasEstadoHabilidad;