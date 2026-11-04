import { Router } from 'express';

import { createMetodoPago, deleteMetodoPago, getMetodoPago, getMetodoPagos, updateMetodoPago} from '../controllers/metodoPago.controllers.js';

const router = Router();


router.get('/', getMetodoPago );

router.get('/:id', getMetodoPagos)


router.post('/', createMetodoPago );


router.patch('/:id', updateMetodoPago)


router.delete('/:id', deleteMetodoPago)

export default router;