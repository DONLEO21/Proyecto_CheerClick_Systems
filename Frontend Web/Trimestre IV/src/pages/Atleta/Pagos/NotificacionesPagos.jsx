const COLORES = { ok: "#1eaf52", aviso: "#fad755", alerta: "#cc0000" };

function NotificacionesPagos({ notificaciones }) {
  return (
    <section id="noti-final-atl">
      <h3 className="atl-titu-final">Notificaciones recientes</h3>
      <h5 className="atl-sub-final">Alertas sobre tu mensualidad</h5>
      {notificaciones.map((n) => (
        <div className="atl-conte-noti" key={n.id}>
          <div className="atl-conte-a">
            <div style={{ height: 15, width: 15, borderRadius: "100%", background: COLORES[n.tipo] }}></div>
            <span className="atl-plan-su">{n.texto}</span>
          </div>
          <span className="atl-plan-valor">{n.fecha}</span>
        </div>
      ))}
    </section>
  );
}
export default NotificacionesPagos;