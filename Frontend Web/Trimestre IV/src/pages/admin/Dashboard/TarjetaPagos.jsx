import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { PAGOS_STATS, RUTA_PAGOS } from "./dashboardAdminData.js";

export default function TarjetaPagos({ onNavigate }) {
  const [pagoActivo, setPagoActivo] = useState(null); // estado resaltado en la torta

  const totalPagos = PAGOS_STATS.reduce((suma, p) => suma + p.cantidad, 0);
  const porcentaje = (n) => (totalPagos ? Math.round((n * 100) / totalPagos) : 0);
  const pagoResaltado = PAGOS_STATS.find((p) => p.id === pagoActivo);

  return (
    <article className="tarjeta-dashboard tarjeta-dashboard--pagos">
      <header className="tarjeta-dashboard__header">
        <h2>Resumen de pagos mensualidades</h2>
      </header>

      <div className="tarjeta-dashboard__contenido contenido-estadisticas">
        <ul className="leyenda-estados" aria-label="leyenda del estado de cuentas">
          {PAGOS_STATS.map((p) => (
            <li
              key={p.id}
              className={pagoActivo === p.id ? "activo" : ""}
              style={{ "--color-estado": p.color }}
              tabIndex={0}
              onMouseEnter={() => setPagoActivo(p.id)}
              onMouseLeave={() => setPagoActivo(null)}
              onFocus={() => setPagoActivo(p.id)}
              onBlur={() => setPagoActivo(null)}
            >
              <span className="punto" style={{ backgroundColor: p.color }}></span>
              <span className="leyenda-estados__nombre">{p.nombre}</span>
              <span className="leyenda-estados__valor">{porcentaje(p.cantidad)}%</span>
            </li>
          ))}
        </ul>

        <div className="grafico-estados">
          <PieChart width={190} height={190}>
            <Pie
              data={PAGOS_STATS}
              dataKey="cantidad"
              nameKey="nombre"
              innerRadius={54}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
              onMouseEnter={(_, i) => setPagoActivo(PAGOS_STATS[i].id)}
              onMouseLeave={() => setPagoActivo(null)}
            >
              {PAGOS_STATS.map((entrada) => (
                <Cell
                  key={entrada.id}
                  fill={entrada.color}
                  fillOpacity={pagoActivo && pagoActivo !== entrada.id ? 0.3 : 1}
                  className={
                    "segmento-torta" +
                    (pagoActivo === entrada.id ? " segmento-torta--activo" : "")
                  }
                />
              ))}
            </Pie>
          </PieChart>

          {/* texto al centro: total de cuentas, o el % del estado resaltado */}
          <div className="grafico-estados__centro">
            <strong>
              {pagoResaltado ? `${porcentaje(pagoResaltado.cantidad)}%` : totalPagos}
            </strong>
            <span>{pagoResaltado ? pagoResaltado.nombre : "Cuentas"}</span>
          </div>
        </div>
      </div>

      <a
        href={RUTA_PAGOS}
        className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--centrado"
        onClick={(e) => {
          e.preventDefault();
          onNavigate(RUTA_PAGOS);
        }}
      >
        Ver registro completo
      </a>
    </article>
  );
}