import usuario from '../assets/icons/usuario.png';
import listaVerificacion from '../assets/icons/lista-de-verificacion.png';
import usuarios from '../assets/icons/usuarios.png';
import calendario from '../assets/icons/calendario.png';
import camisa from '../assets/icons/Camisa.png';
import factura from '../assets/icons/factura.png';
import comentarios from '../assets/icons/comentarios.png';
import estadisticas from '../assets/icons/estadisticas-de-barras.png';

const menuAdmin = [
  { href: '/Admin/Perfil', titulo: 'Perfil', icono: usuario, alt: 'Perfil' },
  { href: '/Admin/Cuentas', titulo: 'Asistencia', icono: listaVerificacion, alt: 'Estado de cuentas' },
  { href: '/Admin/Usuarios', titulo: 'Cuentas de Usuarios', icono: usuarios, alt: 'Validación de cuentas' },
  { href: '/Admin/Horarios', titulo: 'Horarios', icono: calendario, alt: 'Horarios' },
  { href: './pages/Admin/Implementos/Implimentos.jsx', titulo: 'Implementos Deportivos', icono: camisa, alt: 'Implementos' },
  { href: '/Admin/Pagos', titulo: 'Pagos', icono: factura, alt: 'Estado de cuentas' },
  { href: '/Admin/Pqrs', titulo: 'PQRS', icono: comentarios, alt: 'PQRS' },
  { href: '/Admin/Rendimiento', titulo: 'Rendimiento Deportivo', icono: estadisticas, alt: 'Estado de cuentas' },
];

export default menuAdmin;
