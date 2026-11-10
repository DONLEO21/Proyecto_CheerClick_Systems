import { Router } from 'express';
import { createContactoEmergencia, getContactoEmergencia, updateContactoEmergencia, cambiarEstadoContactoEmergencia } from '../controllers/contactoEmergencia.controllers.js';
import { authMiddleware } from '../middlewares/authenticate.middlewares.js';

// Crear una instancia de las rutas de express
const router = Router();

// Define las rutas para los contactos
router.post('/', authMiddleware, createContactoEmergencia);
router.get('/:id', authMiddleware, getContactoEmergencia);
router.patch('/:id', authMiddleware, updateContactoEmergencia);
router.patch('/:id/status', authMiddleware, cambiarEstadoContactoEmergencia);

export default router;