import { Router } from 'express';
import { createHorario, deleteHorario, getHorario, getHorarios, updateHorario } from '../controllers/horarios.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";


const router = Router();

router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getHorario);
router.post('/',[authMiddleware, authorizationMiddleware(['Administrador','Entrenador'])], createHorario);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador','Entrenador'])], updateHorario);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador','Entrenador'])], deleteHorario);
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getHorarios )

export default router;
