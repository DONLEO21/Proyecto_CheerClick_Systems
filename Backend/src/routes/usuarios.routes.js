import { Router } from 'express';
import { getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controllers.js';
import { listSolicitudes, getDetalleUsuario, aprobarSolicitud, rechazarSolicitud, listCuentas, cambiarStatus, cambiarRol } from '../controllers/cuentas.controllers.js';
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router();

// Solo el administrador
const soloAdmin = [ authMiddleware, authorizationMiddleware(['Administrador']) ];

// Solicitudes de cuentas nuevas.
// OJO: van ANTES de '/:id', si no Express tomaría la palabra "solicitudes" como un id
router.get('/solicitudes', soloAdmin, listSolicitudes);
router.patch('/solicitudes/:id/aprobar', soloAdmin, aprobarSolicitud);
router.patch('/solicitudes/:id/rechazar', soloAdmin, rechazarSolicitud);

// Gestión de cuentas
router.get('/', soloAdmin, listCuentas);
router.get('/:id/detalle', soloAdmin, getDetalleUsuario);   // "ojito": pendientes, aprobadas y rechazadas
router.patch('/:id/status', soloAdmin, cambiarStatus);      // interruptor activa/inactiva
router.patch('/:id/rol', soloAdmin, cambiarRol);            // selector de rol

// CRUD básico
router.get('/:id', authMiddleware, getUsuario);
router.post('/', soloAdmin, createUsuario);
router.patch('/:id', soloAdmin, updateUsuario);
router.delete('/:id', soloAdmin, deleteUsuario);

export default router;