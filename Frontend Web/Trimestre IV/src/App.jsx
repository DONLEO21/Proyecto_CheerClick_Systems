import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import Rutaprotegida from './components/Rutaprotegida.jsx';
import Landing from './components/landing/Landing.jsx';
import AuthPage from './components/auth/AuthPage.jsx';
import DashboardAdmin from './pages/admin/Dashboard/DashboardAdmin.jsx';
import SolicitudesCuentas from './pages/admin/Cuentas/SolicitudesCuentas.jsx';
import DashboardEntrenador from './pages/entrenador/Dashboard/DashboardEntrenador.jsx';
import DashboardAtleta from './pages/atleta/Dashboard/DashboardAtleta.jsx';
import PerfilUsuario from './pages/Perfil/PerfilUsuario.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/acceso" element={<AuthPage />} />

        {/* Administrador */}
        <Route
          path="/admin"
          element={
            <Rutaprotegida rolPermitido="administrador">
              <DashboardAdmin />
            </Rutaprotegida>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <Rutaprotegida rolPermitido="administrador">
              <SolicitudesCuentas />
            </Rutaprotegida>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <Rutaprotegida rolPermitido="administrador">
              <PerfilUsuario rol="admin" />
            </Rutaprotegida>
          }
        />

        {/* Entrenador */}
        <Route
          path="/entrenador"
          element={
            <Rutaprotegida rolPermitido="entrenador">
              <DashboardEntrenador />
            </Rutaprotegida>
          }
        />
        <Route
          path="/entrenador/perfil"
          element={
            <Rutaprotegida rolPermitido="entrenador">
              <PerfilUsuario rol="entrenador" />
            </Rutaprotegida>
          }
        />

        {/* Atleta */}
        <Route
          path="/atleta"
          element={
            <Rutaprotegida rolPermitido="atleta">
              <DashboardAtleta />
            </Rutaprotegida>
          }
        />
        <Route
          path="/atleta/perfil"
          element={
            <Rutaprotegida rolPermitido="atleta">
              <PerfilUsuario rol="atleta" />
            </Rutaprotegida>
          }
        />

        {/* Cualquier URL que no exista: evita la pantalla en blanco */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}