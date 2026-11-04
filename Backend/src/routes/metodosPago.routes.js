import { Router } from 'express';
import { createMetodoPago, deleteMetodoPago, getMetodoPago, getMetodoPagos, updateMetodoPago} from '../controllers/metodoPago.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middlewares.js";

const router = Router();

router.get('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getMetodoPago );

router.get('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getMetodoPagos)

router.post('/',[authMiddleware, authorizationMiddleware(['Administrador'])], createMetodoPago );

router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador'])], updateMetodoPago);

router.delete('/:id',[authMiddleware, authorizationMiddleware(['Administrador'])], deleteMetodoPago);

export default router;