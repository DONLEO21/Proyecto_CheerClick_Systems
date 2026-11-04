import { Router } from "express";
import { createJustificacion, deleteJustificacion, getJustificacion, updateJustificacion } from "../controllers/justificacion.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// Define las rutas para justificaciones
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], createJustificacion);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getJustificacion);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteJustificacion);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], updateJustificacion);

// Exportar las rutas definidas en este archivo
export default router;
