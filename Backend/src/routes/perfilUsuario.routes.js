import { Router } from "express";
import { createPerfilUsuario, getPerfilUsuario, updatePerfilUsuario, cambiarEstadoPerfilUsuario, getMiPerfil, updateMiPerfil, updateMiFoto, updateMiCertificado, descargarMiCertificado, updateMisContactos, updateMisPreferencias } from "../controllers/perfilUsuario.controllers.js";
import { authMiddleware } from '../middlewares/authenticate.middlewares.js'
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { subirFotoMiddleware, subirCertificadoMiddleware } from "../services/archivos.services.js";

const router = Router();

router.post('/', authMiddleware, createPerfilUsuario);

router.get('/me', authMiddleware, getMiPerfil);
router.patch('/me', authMiddleware, updateMiPerfil);
router.put('/me/foto', authMiddleware, subirFotoMiddleware, updateMiFoto);
router.put('/me/certificado-eps', authMiddleware, subirCertificadoMiddleware, updateMiCertificado);
router.get('/me/certificado-eps', authMiddleware, descargarMiCertificado);
router.put('/me/contactos', authMiddleware, updateMisContactos);
router.patch('/me/preferencias', authMiddleware, updateMisPreferencias);

router.get('/:id', authMiddleware, getPerfilUsuario);
router.patch('/:id', [ authMiddleware, authorizationMiddleware(['Administrador']) ], updatePerfilUsuario);
router.patch('/:id/estado', authMiddleware, cambiarEstadoPerfilUsuario);

//Exportar las rutas definidas del archivo
export default router;