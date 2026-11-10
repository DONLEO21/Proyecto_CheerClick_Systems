import { Router } from "express";
import { createPerfilUsuario, getPerfilUsuario, updatePerfilUsuario, cambiarEstadoPerfilUsuario} from "../controllers/perfilUsuario.controllers.js";
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router(); 

router.post('/', authMiddleware, createPerfilUsuario);
router.get('/:id', authMiddleware, getPerfilUsuario);
router.patch('/:id', authMiddleware, updatePerfilUsuario);
router.patch('/:id/estado', authMiddleware, cambiarEstadoPerfilUsuario);

//Exportar las rutas definidas en este archivo
export default router;