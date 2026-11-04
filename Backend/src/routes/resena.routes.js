import { Router } from "express";
import { createResena, deleteResena, getResena, updateResena } from "../controllers/resena.controllers.js";

const router = Router();

router.post('/', createResena);
router.get('/', getResena);
router.delete('/:id', deleteResena);
router.patch('/:id', updateResena);

export default router;