import { Router } from "express";
import { getOpcionesTalla, createImplementoTalla, getImplementoTalla, updateImplementoTalla } from "../controllers/implementoTalla.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.get('/opciones', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getOpcionesTalla);
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createImplementoTalla);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getImplementoTalla);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateImplementoTalla);

export default router;