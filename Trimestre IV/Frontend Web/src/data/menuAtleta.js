import usuario from '../assets/icons/usuario.png';
import calendario from '../assets/icons/calendario.png';
import camisa from '../assets/icons/Camisa.png';
import factura from '../assets/icons/factura.png';
import comentarios from '../assets/icons/comentarios.png';
import estadisticas from '../assets/icons/estadisticas-de-barras.png';

// Tomado de BarraAtleta.html
const menuAtleta = [
  { href: '/Atleta/Perfil', titulo: 'Perfil', icono: usuario, alt: 'Perfil' },
  { href: '/Atleta/Horarios', titulo: 'Horarios', icono: calendario, alt: 'Horarios' },
  { href: './pages/Atleta/Implementos/Implementos.jsx', titulo: 'Implementos Deportivos', icono: camisa, alt: 'Implementos' },
  { href: '/Atleta/Pagos', titulo: 'Pagos', icono: factura, alt: 'Estado de cuentas' },
  { href: '/Atleta/Pqrs', titulo: 'PQRS', icono: comentarios, alt: 'PQRS' },
  { href: '/Atleta/Rendimiento', titulo: 'Rendimiento Deportivo', icono: estadisticas, alt: 'Estado de cuentas' },
];

export default menuAtleta;
