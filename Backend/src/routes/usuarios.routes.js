import { Router } from 'express';
import { getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controllers.js';
import { listSolicitudes, getDetalleUsuario, aprobarSolicitud, rechazarSolicitud } from '../controllers/cuentas.controllers.js';
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router();

// Solo el administrador
const soloAdmin = [ authMiddleware, authorizationMiddleware(['Administrador']) ];

// Solicitudes de cuentas nuevas.

router.get('/solicitudes', soloAdmin, listSolicitudes);
router.patch('/solicitudes/:id/aprobar', soloAdmin, aprobarSolicitud);
router.patch('/solicitudes/:id/rechazar', soloAdmin, rechazarSolicitud);

// Detalle visualizar: para pendientes, aprobadas y rechazadas
router.get('/:id/detalle', soloAdmin, getDetalleUsuario);

// CRUD básico
router.get('/:id', authMiddleware, getUsuario);
router.post('/', soloAdmin, createUsuario);
router.patch('/:id', soloAdmin, updateUsuario);
router.delete('/:id', soloAdmin, deleteUsuario);

export default router;