import { Router } from "express";
import { createRespuesta_pqrs, deleteRespuesta_pqrs, getrespuesta_pqrs, getRespuesta_pqrs, updateRespuesta_pqrs } from "../controllers/respuesta_pqrs.crontrollers.js";

const router = Router();

router.post('/', createRespuesta_pqrs);
router.get('/', getRespuesta_pqrs);
router.delete('/:id', deleteRespuesta_pqrs);
router.patch('/:id', updateRespuesta_pqrs );
router.get('/:id', getrespuesta_pqrs);

export default router;