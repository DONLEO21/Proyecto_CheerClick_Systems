import { useSesion } from "../../context/SesionContext";
import { useNavigate } from "react-router-dom";

// Lista de atletas de prueba (coincide con "atletas" en db.json).
// Si agregas/quitas atletas en el db.json, actualiza esta lista también.
const ATLETAS_PRUEBA = [
  { id: "1", nombre: "Valeria Gómez" },
  { id: "2", nombre: "Santiago Ramírez" },
  { id: "3", nombre: "Camila Fernández" },
  { id: "4", nombre: "Mateo Morales" },
  { id: "5", nombre: "Isabella Torres" },
  { id: "6", nombre: "Lucas Castro" },
  { id: "7", nombre: "Mariana López" },
  { id: "8", nombre: "Sofia Mendoza" },
  { id: "9", nombre: "Daniel Vargas" },
  { id: "10", nombre: "Gabriela Ortiz" },
  { id: "11", nombre: "Alejandro Silva" },
  { id: "12", nombre: "Natalia Guerrero" },
  { id: "13", nombre: "Lucía Rojas" },
  { id: "14", nombre: "Sebastián Delgado" },
  { id: "15", nombre: "Elena Benítez" },
];

function SelectorRol() {
  const { sesion, setSesion } = useSesion();
  const navigate = useNavigate();

  const cambiar = (rol) => {
    setSesion({ ...sesion, rol });
    navigate(rol === "admin" ? "/admin/pagos" : "/atleta/pagos");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 3000,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        gap: 6,
        alignItems: "center",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#888" }}>🧪</span>
      <select value={sesion.rol} onChange={(e) => cambiar(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="atleta">Atleta</option>
      </select>

      {sesion.rol === "atleta" && (
        <select
          value={sesion.atletaId}
          onChange={(e) => setSesion({ ...sesion, atletaId: e.target.value })}
        >
          {ATLETAS_PRUEBA.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default SelectorRol;