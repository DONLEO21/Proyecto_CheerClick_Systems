import { Router } from 'express';
import { createPago, getPago, getPagos, updatePagoPatch } from '../controllers/pagos.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middlewares.js";

const router = Router();

//Obtener todos los pagos
router.get('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getPagos);

router.get('/:id' ,[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])],  getPago);

//Regitrar nuevos pagos
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], createPago);

//Actualizar los pagos parcialmente
router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], updatePagoPatch);

export default router;