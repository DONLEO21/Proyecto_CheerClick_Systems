import { Router } from 'express';
import { CreatePlanAsociado, DeletePlanAsociado, GetPlanAsociado, GetPlanesAsociados, UpdatePlanAsociado } from '../controllers/planAsociado.controllers.js';

const router = Router();

router.get('/', GetPlanAsociado);

router.get('/:id',GetPlanesAsociados );

router.post('/', CreatePlanAsociado);

router.delete('/:id',DeletePlanAsociado)

router.patch( '/:id', UpdatePlanAsociado)


export default router;