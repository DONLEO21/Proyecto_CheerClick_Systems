import { Router } from 'express';
import { createPago, deletePago, getPago, getPagos, updatePagoPatch } from '../controllers/pagos.controllers.js';

const router = Router();

//Obtener todos los pagos
router.get('/', getPagos);

router.get('/:id' , getPago)

//Regitrar nuevos pagos
router.post('/', createPago);

//Actualizar los pagos parcialmente
router.patch('/:id', updatePagoPatch)

//Eliminar pago
router.delete('/:id', deletePago)

export default router;