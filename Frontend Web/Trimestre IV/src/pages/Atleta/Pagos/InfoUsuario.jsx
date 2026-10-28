function InfoUsuario({ atleta }) {
  return (
    <aside id="infor-usuario-atl">
      <div id="infor-usua-atl">
        <div id="detalle-usu-atl"></div>
        <h3>
          {atleta?.nombre ?? "Cargando…"}
          <p>Atleta · {atleta?.nivel ?? ""}</p>
        </h3>
      </div>
      <div id="perfil-atl">
        <button type="button">
          <svg id="lapiz-atl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
          Perfil
        </button>
      </div>
    </aside>
  );
}
export default InfoUsuario;