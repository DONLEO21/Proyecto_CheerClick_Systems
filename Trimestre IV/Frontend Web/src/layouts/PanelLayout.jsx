
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import '../index.css'; 

function PanelLayout({ items, rol, inicioHref = '/' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleCerrarSesion = () => {
    navigate('/login');
  };

  return (
    <>
      <Sidebar items={items} activeHref={pathname} onNavigate={navigate} />
      <Header rol={rol} onCerrarSesion={handleCerrarSesion} inicioHref={inicioHref} />

      <main className="contenido-principal">
        <Outlet />
      </main>
    </>
  );
}
export default PanelLayout
