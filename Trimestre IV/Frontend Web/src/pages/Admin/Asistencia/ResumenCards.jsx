export default function ResumenCards({ total, porcentaje, presentesMasInpuntuales, faltas }) {
  return (
    <div className="row g-3 resumen-cards">
      <div className="col-6 col-md-3">
        <div className="rcard rcard-total">
          <div className="rcard-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="rcard-info d-flex flex-column flex-grow-1">
            <span className="rcard-num">{total}</span>
            <span className="rcard-label">Total atletas</span>
          </div>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="rcard rcard-pct">
          <div className="rcard-icon rcard-icon-pct">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="rcard-info d-flex flex-column flex-grow-1">
            <span className="rcard-num rcard-num-pct">{porcentaje}%</span>
            <span className="rcard-label">Asistencia hoy</span>
          </div>
          <div className="rcard-bar-wrap">
            <div className="rcard-bar rcard-bar-pct" style={{ width: `${porcentaje}%` }} />
          </div>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="rcard rcard-presente">
          <div className="rcard-icon rcard-icon-presente">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1eaf52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="rcard-info d-flex flex-column flex-grow-1">
            <span className="rcard-num rcard-num-presente">{presentesMasInpuntuales}</span>
            <span className="rcard-label">Presentes + Inpuntuales</span>
          </div>
          <div className="rcard-bar-wrap">
            <div className="rcard-bar rcard-bar-presente" style={{ width: `${porcentaje}%` }} />
          </div>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="rcard rcard-falta">
          <div className="rcard-icon rcard-icon-falta">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <div className="rcard-info d-flex flex-column flex-grow-1">
            <span className="rcard-num rcard-num-falta">{faltas}</span>
            <span className="rcard-label">Faltas registradas</span>
          </div>
          <div className="rcard-bar-wrap">
            <div className="rcard-bar rcard-bar-falta" style={{ width: `${100 - porcentaje}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
