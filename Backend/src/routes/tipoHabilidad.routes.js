import { Router } from 'express';
import { createTipoHabilidad, deleteTipoHabilidad, getTipoHabilidad, getTipoHabilidades, updateTipoHabilidad } from '../controllers/tipoHabilidad.controllers.js';

const router = Router();


router.get('/', getTipoHabilidades);

router.get('/:id', getTipoHabilidad)


router.post('/', createTipoHabilidad);


router.patch('/:id', updateTipoHabilidad)


router.delete('/:id', deleteTipoHabilidad)

export default router;