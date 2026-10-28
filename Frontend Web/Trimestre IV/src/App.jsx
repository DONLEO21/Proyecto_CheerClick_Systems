import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';

import { SesionProvider } from './context/SesionContext';

import menuAdmin from './data/menuAdmin';
import menuAtleta from './data/menuAtleta';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

import AdminPagos from './pages/Admin/Pagos/Pagos';
import AtletaPagos from './pages/Atleta/Pagos/Pagos';


function RutaProtegida({ rolPermitido, children }) {

  return children;
}

function Layout({ items, rol, inicioHref }) {
  return (
    <>
      <Sidebar items={items} />
      <Header rol={rol} inicioHref={inicioHref} />
      <main style={{ marginLeft: 56, marginTop: 55 }}>
        <Outlet />
      </main>
    </>
  );
}


export default function App() {
  return (
    <SesionProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <RutaProtegida rolPermitido="administrador">
                <Layout items={menuAdmin} rol="Administrador" inicioHref="/admin/pagos" />
              </RutaProtegida>
            }
          >
            <Route index element={<Navigate to="pagos" replace />} />
            <Route path="pagos" element={<AdminPagos />} />
          </Route>


          <Route
            path="/atleta"
            element={
              <RutaProtegida rolPermitido="atleta">
                <Layout items={menuAtleta} rol="Atleta" inicioHref="/atleta/pagos" />
              </RutaProtegida>
            }
          >
            <Route index element={<Navigate to="pagos" replace />} />
            <Route path="pagos" element={<AtletaPagos />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/pagos" replace />} />
        </Routes>
      </BrowserRouter>
    </SesionProvider>
  );
}