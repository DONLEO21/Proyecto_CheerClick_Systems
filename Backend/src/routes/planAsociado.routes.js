import { Router } from 'express';
import { CreatePlanAsociado, DeletePlanAsociado, GetPlanAsociado, GetPlanesAsociados, UpdatePlanAsociado } from '../controllers/planAsociado.controllers.js';
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middlewares.js";

const router = Router();

router.get('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], GetPlanAsociado);

router.get('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], GetPlanesAsociados );

router.post('/',[authMiddleware, authorizationMiddleware(['Administrador'])], CreatePlanAsociado);

router.patch( '/:id',[authMiddleware, authorizationMiddleware(['Administrador'])], UpdatePlanAsociado);


export default router;