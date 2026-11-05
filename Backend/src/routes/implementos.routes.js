import { Router } from "express";
import { createImplemento, getImplemento, updateImplemento } from "../controllers/implementos.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createImplemento);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getImplemento);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateImplemento);

export default router;