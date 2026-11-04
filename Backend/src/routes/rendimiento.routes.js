import { Router } from "express";
import { createRendimiento, deleteRendimiento, getRendimiento, updateRendimiento } from "../controllers/rendimiento.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createRendimiento);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getRendimiento);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], deleteRendimiento);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateRendimiento);

export default router;