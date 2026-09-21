import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'

import RendimientoAdmin from './pages/Admin/Rendimiento/Rendimiento.jsx'
import RendimientoAtleta from './pages/Atleta/Rendimiento/Rendimiento.jsx'

function Inicio() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido</h1>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/admin/rendimiento">Rendimiento (Administrador)</Link>
        <Link to="/atleta/rendimiento">Rendimiento (Atleta)</Link>
      </nav>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/admin/rendimiento" element={<RendimientoAdmin />} />
      <Route path="/atleta/rendimiento" element={<RendimientoAtleta />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App