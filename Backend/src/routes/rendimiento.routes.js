import { Router } from "express";
import {
    createRendimiento, deleteRendimiento, getRendimiento, getRendimientoAtleta,
    getResumenRendimiento, guardarRendimientoAtleta, updateRendimiento
} from "../controllers/rendimiento.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// Las rutas fijas van antes que '/:id'
router.get('/resumen', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], getResumenRendimiento);
router.get('/atleta/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getRendimientoAtleta);
router.put('/atleta/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], guardarRendimientoAtleta);

router.post('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createRendimiento);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getRendimiento);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateRendimiento);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], deleteRendimiento);

export default router;