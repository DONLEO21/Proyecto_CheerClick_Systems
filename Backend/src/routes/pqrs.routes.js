import { Router } from "express";
import { createPqrs, deletePqrs, getpqrs, getPqrs, updatePqrs } from "../controllers/pqrs.crontrollers.js";

const router = Router();

router.post('/', createPqrs );
router.get('/', getPqrs);
router.delete('/:id', deletePqrs);
router.patch('/:id', updatePqrs);
router.get('/:id', getpqrs);

export default router;