import { Router } from "express";
import {
    createAsistencia, deleteAsistencia, getAsistencia,
    getPlanilla, guardarAsistenciaDia, updateAsistencia
} from "../controllers/asistencia.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.get('/planilla',  [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], getPlanilla);
router.put('/dia',  [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], guardarAsistenciaDia);
router.post('/',  [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], createAsistencia);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador', 'Atleta'])], getAsistencia);
router.patch('/:id',  [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], updateAsistencia);
router.delete('/:id',  [authMiddleware, authorizationMiddleware(['Administrador', 'Entrenador'])], deleteAsistencia);   

export default router;