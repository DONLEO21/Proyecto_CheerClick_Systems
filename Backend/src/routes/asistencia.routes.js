import { Router } from "express";
import { createAsistencia, deleteAsistencia, getAsistencia, updateAsistencia } from "../controllers/asistencia.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// Define las rutas para asistencias
router.post('/',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createAsistencia);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getAsistencia);
router.delete('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], deleteAsistencia);
router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateAsistencia);

// Exportar las rutas definidas en este archivo
export default router;
