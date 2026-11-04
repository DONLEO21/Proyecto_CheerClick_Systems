import { Router } from "express";
import { createRendimiento, deleteRendimiento, getRendimiento, updateRendimiento } from "../controllers/rendimiento.controllers.js";

const router = Router();

router.post('/', createRendimiento);
router.get('/', getRendimiento);
router.delete('/:id', deleteRendimiento);
router.patch('/:id', updateRendimiento);

export default router;