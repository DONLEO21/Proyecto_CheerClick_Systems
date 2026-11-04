import { Router } from 'express';
import { getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controllers.js';
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router();

// Definicion de las rutas para usuarios

router.get('/:id', getUsuario);
router.post('/', [ authMiddleware , authorizationMiddleware(['Administrador'])], createUsuario);
router.patch('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;