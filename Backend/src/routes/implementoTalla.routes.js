import { Router } from "express";
import { getOpcionesTalla, createImplementoTalla, deleteImplementoTalla, getImplementoTalla, updateImplementoTalla } from "../controllers/implementoTalla.controllers.js";

const router = Router();

router.get('/opciones', getOpcionesTalla);
router.post('/', createImplementoTalla);
router.get('/', getImplementoTalla);
router.delete('/:id', deleteImplementoTalla);
router.patch('/:id', updateImplementoTalla);

export default router;