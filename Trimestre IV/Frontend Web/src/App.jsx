import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PanelLayout from './layouts/PanelLayout';

import menuAdmin from './data/menuAdmin';
import menuAtleta from './data/menuAtleta';
import menuEntrenador from './data/menuEntrenador';

import HomePage from './pages/Home/HomePage';
import Login from './pages/Login/Login';

import AdminImplementos from './pages/Admin/Implementos/Implementos';

import AtletaImplementos from './pages/Atleta/Implementos/Implementos';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Área Admin — el login debe llevar aquí, no a /admin/perfil */}
        <Route element={<PanelLayout items={menuAdmin} rol="Administrador" inicioHref="/admin/dashboard" />}>
          <Route path="/admin/implementos" element={<AdminImplementos />} />
        </Route>

        {/* Área Atleta — el login debe llevar aquí, no a /atleta/perfil */}
        <Route element={<PanelLayout items={menuAtleta} rol="Atleta" inicioHref="/atleta/dashboard" />}>
          <Route path="/atleta/implementos" element={<AtletaImplementos />} />
        </Route>

        {/* Área Entrenador — sin PQRS; el login debe llevar aquí, no a /entrenador/perfil */}
        <Route element={<PanelLayout items={menuEntrenador} rol="Entrenador" inicioHref="/entrenador/dashboard" />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
