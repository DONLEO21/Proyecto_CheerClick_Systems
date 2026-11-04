import { Router } from "express";
import { createImplemento, deleteImplemento, getImplemento, updateImplemento } from "../controllers/implementos.controllers.js";

const router = Router();

router.post('/', createImplemento);
router.get('/', getImplemento);
router.delete('/:id', deleteImplemento);
router.patch('/:id', updateImplemento);

export default router;