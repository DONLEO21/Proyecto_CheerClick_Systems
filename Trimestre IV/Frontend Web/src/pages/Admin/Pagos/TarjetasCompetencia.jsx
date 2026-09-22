function TarjetasCompetencia({ grupos, onVerDetalle }) {
  return (
    <section id="campe-cate" className="container">
      {grupos.map((grupo) => (
        <div className="seccion-campe" key={grupo.nivel}>
          <h3 className="titu-campe-nivel">Campeonatos {grupo.nivel}</h3>
          <span className="infor-adicional">{grupo.equipo}</span>
          <div className="detalle-lin"></div>

          <div className="row g-3 mt-1">
            {grupo.tarjetas.map((c) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={c.id}>
                <div className="targe-campe">
                  <div className="portada-campe">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
                      <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
                      <path d="M18 9h1.5a1 1 0 0 0 0-5H18" /><path d="M4 22h16" />
                      <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
                      <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
                    </svg>
                  </div>
                  <div className="cuerpo-campe">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h4 className="titu-campe">{c.nombre}</h4>
                      <span className="fecha-campe">{c.fecha}</span>
                    </div>
                    <p className="ubi-campe">📍 {c.ubicacion}</p>
                    <span className="precio-campe">
                      {c.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })} Inscripción
                    </span>

                    <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                      <span className="cantidad-campe">{c.pagados}/{c.inscritos} pagados</span>
                      <span className="porcentaje-campe">{c.porcentaje}%</span>
                    </div>
                    <div className="barra-ren progress w-100" style={{ height: "8px" }}>
                      <div className="barra-fill progress-bar" style={{ width: `${c.porcentaje}%` }}></div>
                    </div>

                    <button className="btn-ver-detalles" onClick={() => onVerDetalle(c)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {grupos.length === 0 && (
        <p className="text-center text-muted py-4">Ninguna competencia coincide con la búsqueda.</p>
      )}
    </section>
  );
}

export default TarjetasCompetencia;