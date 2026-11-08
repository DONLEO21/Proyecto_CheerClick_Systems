import { Router } from 'express';
import { createHabilidad, deleteHabilidad, getHabilidad, getHabilidades, updateHabilidad } from '../controllers/habilidades.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.get('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getHabilidades);

router.get('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getHabilidad);

router.post('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createHabilidad);

router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateHabilidad);

export default router;