import { Router } from 'express';
import { createHorario, deleteHorario, getHorario, getHorarios, updateHorario } from '../controllers/horarios.controllers.js';

const router = Router();

router.get('/', getHorario);
router.post('/', createHorario);
router.patch('/:id', updateHorario);
router.delete('/:id', deleteHorario);
router.get('/:id', getHorarios )

export default router;
