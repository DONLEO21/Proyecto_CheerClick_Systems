import { Router } from 'express';
import { getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controllers.js';
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router();

// Definicion de las rutas para usuarios

router.get('/:id', authMiddleware, getUsuario);
router.post('/', [ authMiddleware , authorizationMiddleware(['Administrador'])], createUsuario);
router.patch('/:id', [ authMiddleware , authorizationMiddleware(['Administrador'])], updateUsuario);
router.delete('/:id', [ authMiddleware , authorizationMiddleware(['Administrador'])], deleteUsuario);

export default router;