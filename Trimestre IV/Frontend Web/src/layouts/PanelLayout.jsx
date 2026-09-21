import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import '../index.css'; // .contenido-principal


function PanelLayout({ items, rol, inicioHref = '/' }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // limpiar auth/sesión aquí (token, contexto, etc.)
    navigate('/login');
  };

  return (
    <>
      <Sidebar items={items} />
      <Header rol={rol} onCerrarSesion={handleCerrarSesion} inicioHref={inicioHref} />

      <main className="contenido-principal">
        <Outlet />
      </main>
    </>
  );
}
export default PanelLayout