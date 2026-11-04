import { Router } from "express";
import { createCompetencia, getCompetencia, updateCompetencia, getCompetencias } from "../controllers/competencias.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();


router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getCompetencia);
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getCompetencias);
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createCompetencia);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateCompetencia);


export default router;