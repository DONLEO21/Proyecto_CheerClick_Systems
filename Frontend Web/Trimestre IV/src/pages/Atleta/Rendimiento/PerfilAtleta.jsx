import { iniciales } from "../../../services/data";
import { obtenerEstiloNivel } from "../../../components/utils/nivelEstilos";

function PerfilAtleta({ atleta }) {
  return (
    <div className="perfil-atleta">
      {atleta.foto ? (
        <img className="perfil-atleta__foto" src={atleta.foto} alt={`Foto de ${atleta.nombre}`} />
      ) : (
        <span className="perfil-atleta__foto perfil-atleta__foto--iniciales" aria-hidden="true">
          {iniciales(atleta.nombre)}
        </span>
      )}
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