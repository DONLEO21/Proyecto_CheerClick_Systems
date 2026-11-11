import { Router } from "express";
import { createPerfilUsuario, getPerfilUsuario, updatePerfilUsuario, cambiarEstadoPerfilUsuario, getMiPerfil, updateMiPerfil } from "../controllers/perfilUsuario.controllers.js";
import { authMiddleware } from '../middlewares/authenticate.middlewares.js'
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'

const router = Router();

router.post('/', authMiddleware, createPerfilUsuario);
router.get('/me', authMiddleware, getMiPerfil);               // Mi perfil
router.patch('/me', authMiddleware, updateMiPerfil);          // Editar mi información
router.get('/:id', authMiddleware, getPerfilUsuario);
router.patch('/:id', [ authMiddleware, authorizationMiddleware(['Administrador']) ], updatePerfilUsuario);
router.patch('/:id/estado', authMiddleware, cambiarEstadoPerfilUsuario);

//Exportar las rutas definidas en este archivo
export default router;