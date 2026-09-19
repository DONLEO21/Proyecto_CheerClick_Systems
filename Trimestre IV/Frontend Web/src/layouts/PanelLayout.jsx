import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import '../index.css'; // .contenido-principal

/**
 * Layout compartido entre Admin, Atleta y Entrenador.
 * Cada rol lo usa así en las rutas, pasándole SU propio menú, rol
 * y a dónde debe llevar el ícono de "inicio" del Header (su dashboard):
 *
 *   <Route element={<PanelLayout items={menuAdmin} rol="Administrador" inicioHref="/admin/dashboard" />}>
 *     <Route path="/admin/dashboard" element={<Dashboard />} />
 *     ...
 *   </Route>
 *
 * Las páginas hijas se renderizan en <Outlet /> según la ruta activa.
 */
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
