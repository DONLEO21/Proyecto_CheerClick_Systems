import './landing.css';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import Nosotros from './Nosotros.jsx';
import Servicios from './Servicios.jsx';
import Niveles from './Niveles.jsx';
import Horarios from './Horarios.jsx';
import Footer from './Footer.jsx';

export default function Landing() {
  return (
    <div className="pagina-landing">
      <Navbar />
      <Hero />
      <Nosotros />
      <Servicios />
      <Niveles />
      <Horarios />
      <Footer />
    </div>
  );
}