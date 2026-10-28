import { Router } from "express";
import { createNivel, deleteNivel, getNivel, getNiveles, updateNivel } from "../controllers/niveles.controllers.js";

const router = Router();

router.get('/', getNivel);
router.post('/', createNivel);
router.patch('/:id', updateNivel );
router.delete('/:id', deleteNivel);
router.get('/:id', getNiveles )



export default router;