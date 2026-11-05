import { Router } from "express";
import { createResena, getResena, updateResena } from "../controllers/resena.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createResena);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getResena);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Atleta'])], updateResena);

export default router;