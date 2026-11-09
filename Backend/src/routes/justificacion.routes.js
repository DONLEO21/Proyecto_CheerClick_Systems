import { Router } from "express";
import {
    createJustificacion, deleteJustificacion, getJustificacion, updateJustificacion
} from "../controllers/justificacion.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// Solo el atleta justifica
router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createJustificacion);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getJustificacion);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateJustificacion);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteJustificacion);

export default router;