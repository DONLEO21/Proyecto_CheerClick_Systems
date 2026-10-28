import { Router } from "express";
import { createCompetencia, deleteCompetencia, getCompetencia, updateCompetencia, getCompetencias } from "../controllers/competencias.controllers.js";


const router = Router();

router.get('/', getCompetencia);
router.post('/', createCompetencia)
router.delete('/:id', deleteCompetencia)
router.patch('/:id', updateCompetencia )
router.get('/:id', getCompetencias )

export default router;