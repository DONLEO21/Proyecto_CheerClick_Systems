import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import '../index.css'; 

function PanelLayout({ items, rol, inicioHref = '/' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeHref = items.find((item) => item.href.toLowerCase() === pathname.toLowerCase())?.href;

  const handleCerrarSesion = () => {
    navigate('/login');
  };

  return (
    <>

      <Sidebar items={items} activeHref={pathname} onNavigate={navigate} />
      <Header rol={rol} onCerrarSesion={handleCerrarSesion} inicioHref={inicioHref} />

      <Sidebar items={items} activeHref={activeHref} onNavigate={navigate} />
      <Header rol={rol} onCerrarSesion={handleCerrarSesion} inicioHref={inicioHref} onIrInicio={() => navigate(inicioHref)} />

      <main className="contenido-principal">
        <Outlet />
      </main>
    </>
  );
}

export default PanelLayout

