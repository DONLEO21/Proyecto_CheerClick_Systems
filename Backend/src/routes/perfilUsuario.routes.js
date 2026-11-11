import { Router } from "express";
import { createPerfilUsuario, getPerfilUsuario, updatePerfilUsuario, cambiarEstadoPerfilUsuario, getMiPerfil, updateMiPerfil, updateMiFoto } from "../controllers/perfilUsuario.controllers.js";
import { authMiddleware } from '../middlewares/authenticate.middlewares.js'
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { subirFotoMiddleware } from "../services/archivos.services.js";

const router = Router();

router.post('/', authMiddleware, createPerfilUsuario);

router.get('/me', authMiddleware, getMiPerfil);
router.patch('/me', authMiddleware, updateMiPerfil);
router.put('/me/foto', authMiddleware, subirFotoMiddleware, updateMiFoto);

router.get('/:id', authMiddleware, getPerfilUsuario);
router.patch('/:id', [ authMiddleware, authorizationMiddleware(['Administrador']) ], updatePerfilUsuario);
router.patch('/:id/estado', authMiddleware, cambiarEstadoPerfilUsuario);

//Exportar las rutas definidas en este archivo
export default router;