import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import PanelLayout from './layouts/PanelLayout';

import menuAdmin from './data/menuAdmin';
import menuAtleta from './data/menuAtleta';
import menuEntrenador from './data/menuEntrenador';

import AdminHorarios from "./pages/Admin/Horarios/Horarios.jsx";
import AdminPQRS from "./pages/Admin/PQRS/PQRS.jsx";
import AdminImplementos from './pages/Admin/Implementos/Implementos';

import AtletaImplementos from './pages/Atleta/Implementos/Implementos';
import AtletaHorarios from './pages/Atleta/Horarios/Horarios.jsx';
import AtletaPQRS from "./pages/Atleta/PQRS/PQRS.jsx";

import EntrenadorHorarios from './pages/Entrenador/Horarios/Horarios.jsx';
import Proximamente from './components/Compartidos/Proximamente.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/admin/horarios" replace />} />

        <Route path="/admin" element={<PanelLayout items={menuAdmin} rol="Administrador" inicioHref="/admin/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          <Route path="horarios" element={<AdminHorarios />} />
          <Route path="pqrs" element={<AdminPQRS />} />
          <Route path="/admin/implementos" element={<AdminImplementos />} />

          <Route path="calendario" element={<EntrenadorHorarios esAdmin={true} />} />

          <Route path="*" element={<Proximamente />} />
        </Route>

        {/* Área Atleta */}
        <Route path="/atleta" element={<PanelLayout items={menuAtleta} rol="Atleta" inicioHref="/atleta/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          <Route path="horarios" element={<AtletaHorarios />} />
          <Route path="pqrs" element={<AtletaPQRS remitente="Leonardo Jara Molina" />} />
          <Route path="*" element={<Proximamente />} />
          <Route path="/atleta/implementos" element={<AtletaImplementos />} />
        </Route>

        {/* Área Entrenador */}
        <Route path="/entrenador" element={<PanelLayout items={menuEntrenador} rol="Entrenador" inicioHref="/entrenador/horarios" />}>
          <Route index element={<Navigate to="horarios" replace />} />
          <Route path="horarios" element={<EntrenadorHorarios esAdmin={false} nivelIdEntrenador={3} />} />
          <Route path="*" element={<Proximamente />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
