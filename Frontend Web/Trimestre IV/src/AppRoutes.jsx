import { Routes, Route, Navigate } from 'react-router-dom'
import Rutaprotegida from './components/Rutaprotegida'

import Landing from './components/landing/Landing'
import AuthPage from './components/auth/AuthPage'
import DashboardAdmin from './pages/admin/Dashboard/DashboardAdmin'
import SolicitudesCuentas from './pages/admin/Dashboard/SolicitudesCuentas'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Administrador */}
      <Route path="/administrador" element={
        <Rutaprotegida rolPermitido="administrador"><DashboardAdmin /></Rutaprotegida>
      } />
      <Route path="/administrador/cuentas" element={
        <Rutaprotegida rolPermitido="administrador"><SolicitudesCuentas /></Rutaprotegida>
      } />

      {/* Atleta (descomenta cuando tengas el import) */}
      {/* <Route path="/atleta" element={
        <Rutaprotegida rolPermitido="atleta"><DashboardAtleta /></Rutaprotegida>
      } /> */}

      {/* Entrenador (descomenta cuando tengas el import) */}
      {/* <Route path="/entrenador" element={
        <Rutaprotegida rolPermitido="entrenador"><DashboardEntrenador /></Rutaprotegida>
      } /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}