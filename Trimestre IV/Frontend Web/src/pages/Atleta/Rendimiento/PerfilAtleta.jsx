import imgusuario from "../../../assets/icons/usuarios.png";
import { obtenerEstiloNivel } from "../../../components/utils/nivelEstilos";

function PerfilAtleta({ atleta }) {
  return (
    <div className="perfil-atleta">
      <img className="perfil-atleta__foto" src={imgusuario} alt="Foto de perfil" />
      <div className="perfil-atleta__info">
        <h3>{atleta.nombre}</h3>
        <p>Edad: {atleta.edad} años</p>
        <span className="badge-nivel" style={obtenerEstiloNivel(atleta.nivel)}>
          {atleta.nivel}
        </span>
      </div>
    </div>
  );
}

export default PerfilAtleta;