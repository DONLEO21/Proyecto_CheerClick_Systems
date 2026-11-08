import { Router } from 'express';
import { createTipoHabilidad, deleteTipoHabilidad, getTipoHabilidad, getTipoHabilidades, updateTipoHabilidad } from '../controllers/tipoHabilidad.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.get('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getTipoHabilidades);

router.get('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getTipoHabilidad);

router.post('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createTipoHabilidad);

router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateTipoHabilidad);

router.delete('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], deleteTipoHabilidad);

export default router;