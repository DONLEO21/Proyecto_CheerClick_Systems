import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1>Iniciar sesión</h1>
      <p>Placeholder — aquí va tu formulario real. Por ahora, elige un rol para simular el login:</p>
      <div className="d-flex gap-2">
        <button className="btn btn-danger" onClick={() => navigate('/admin/dashboard')}>
          Entrar como Administrador
        </button>
        <button className="btn btn-danger" onClick={() => navigate('/atleta/dashboard')}>
          Entrar como Atleta
        </button>
        <button className="btn btn-danger" onClick={() => navigate('/entrenador/dashboard')}>
          Entrar como Entrenador
        </button>
      </div>
    </div>
  );
}
export default Login
