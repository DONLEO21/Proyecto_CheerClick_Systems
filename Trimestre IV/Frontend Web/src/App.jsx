import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import PanelLayout from './layouts/PanelLayout';

import menuAdmin from './data/menuAdmin';
import menuAtleta from './data/menuAtleta';
import menuEntrenador from './data/menuEntrenador';

import AdminHorarios from "./pages/Admin/Horarios/Horarios.jsx";
import AdminPQRS from "./pages/Admin/PQRS/PQRS.jsx";
import AtletaHorarios from './pages/Atleta/Horarios/Horarios.jsx';
import EntrenadorHorarios from './pages/Entrenador/Horarios/Horarios.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mientras se une el resto del proyecto (login, home, etc.),
            la raíz redirige directo al módulo de horarios del admin. */}
        <Route path="/" element={<Navigate to="/admin/horarios" replace />} />

        {/* Área Admin */}
        <Route path="/admin" element={<PanelLayout items={menuAdmin} rol="Administrador" inicioHref="/admin/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          <Route path="horarios" element={<AdminHorarios />} />
          <Route path="pqrs" element={<AdminPQRS />} />

          {/* Vista Entrenador del Admin: es entrenador de TODOS los niveles,
              por eso esAdmin=true habilita el selector para cambiar de nivel. */}
          <Route path="calendario" element={<EntrenadorHorarios esAdmin={true} />} />
        </Route>

        {/* Área Atleta */}
        <Route path="/atleta" element={<PanelLayout items={menuAtleta} rol="Atleta" inicioHref="/atleta/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          <Route path="horarios" element={<AtletaHorarios />} />
        </Route>

        {/* Área Entrenador */}
        <Route path="/entrenador" element={<PanelLayout items={menuEntrenador} rol="Entrenador" inicioHref="/entrenador/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          {/* TODO: esAdmin y nivelIdEntrenador deben salir de la sesión real
              cuando exista login/auth. Por ahora, esAdmin=false simula un
              entrenador normal viendo solo su propio nivel (id 3 = Magic). */}
          <Route path="horarios" element={<EntrenadorHorarios esAdmin={false} nivelIdEntrenador={3} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
