import { Router } from "express";
import { createImplemento, deleteImplemento, getImplemento, updateImplemento } from "../controllers/implementos.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createImplemento);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getImplemento);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteImplemento);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateImplemento);

export default router;