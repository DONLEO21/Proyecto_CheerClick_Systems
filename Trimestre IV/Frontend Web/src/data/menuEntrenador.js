import usuario from '../assets/icons/usuario.png';
import listaVerificacion from '../assets/icons/lista-de-verificacion.png';
import calendario from '../assets/icons/calendario.png';
import estadisticas from '../assets/icons/estadisticas-de-barras.png';

// Tomado de BarraEntre.html — sin PQRS, por indicación explícita
const menuEntrenador = [
  { href: '/Entrenador/Perfil', titulo: 'Perfil', icono: usuario, alt: 'Perfil' },
  { href: '/Entrenador/Asistencia', titulo: 'Asistencia', icono: listaVerificacion, alt: 'Estado de cuentas' },
  { href: '/Entrenador/Horarios', titulo: 'Horarios', icono: calendario, alt: 'Horarios' },
  { href: '/Entrenador/Rendimiento', titulo: 'Rendimiento Deportivo', icono: estadisticas, alt: 'Estado de cuentas' },
];

export default menuEntrenador;
