import { Router } from 'express';
import { createHabilidad, deleteHabilidad, getHabilidad, getHabilidades, updateHabilidad } from '../controllers/habilidades.controllers.js';

const router = Router();


router.get('/', getHabilidades);

router.get('/:id', getHabilidad)


router.post('/', createHabilidad);


router.patch('/:id', updateHabilidad)


router.delete('/:id', deleteHabilidad)

export default router;