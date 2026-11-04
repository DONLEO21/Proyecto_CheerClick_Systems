import { Router } from 'express';
import { getUsuario, createUsuario, updateUsuario, updateUsuarioP, deleteUsuario } from '../controllers/usuarios.controllers.js';

const router = Router();

// Definicion de las rutas para usuarios

router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/', updateUsuario);
router.patch('/', updateUsuarioP);
router.delete('/', deleteUsuario);


export default router;