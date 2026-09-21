import { Routes, Route, Navigate } from 'react-router-dom'
import PanelLayout from './layouts/PanelLayout';

import menuAdmin from './data/menuAdmin';
import menuAtleta from './data/menuAtleta';
import menuEntrenador from './data/menuEntrenador';

import AdminAsistencia from './pages/Admin/Asistencia/Asistencia';
import EntreAsistencia from './pages/Entrenador/Asistencia/Asistencia'
import RendimientoAdmin from './pages/Admin/Rendimiento/Rendimiento.jsx'
import RendimientoAtleta from './pages/Atleta/Rendimiento/Rendimiento.jsx'

export default function App() {
  return (
      <Routes>

        {/* Área Admin — el login debe llevar aquí, no a /admin/perfil */}
        <Route element={<PanelLayout items={menuAdmin} rol="Administrador" inicioHref="/admin/dashboard" />}>
          <Route path="/admin/asistencia" element={<AdminAsistencia />} />
          <Route path="/admin/rendimiento" element={<RendimientoAdmin />} />
        </Route>

        {/* Área Atleta — el login debe llevar aquí, no a /atleta/perfil */}
        <Route element={<PanelLayout items={menuAtleta} rol="Atleta" inicioHref="/atleta/dashboard" />}>
          <Route path="/atleta/rendimiento" element={<RendimientoAtleta />} />
        </Route>

        {/* Área Entrenador — sin PQRS; el login debe llevar aquí, no a /entrenador/perfil */}
        <Route element={<PanelLayout items={menuEntrenador} rol="Entrenador" inicioHref="/entrenador/dashboard" />}>
          <Route path="/entrenador/asistencia" element={<EntreAsistencia />} />
        </Route>
      </Routes>
  );
}