import { Router } from 'express';
import { createContactoEmergencia, deleteContactoEmergencia, getContactoEmergencia, updateContactoEmergencia } from '../controllers/contactoEmergencia.controllers.js';

// Crear una instancia de las rutas de express
const router = Router();

// Define las rutas para los contactos
router.post( '/', createContactoEmergencia);
router.get('/:id', getContactoEmergencia);
router.delete('/:id', deleteContactoEmergencia);
router.patch('/:id', updateContactoEmergencia)

export default router;