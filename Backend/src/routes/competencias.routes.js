import { Router } from "express";
import { createCompetencia, deleteCompetencia, getCompetencia, updateCompetencia, getCompetencias } from "../controllers/competencias.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// LISTA de competencias (el filtro por rol y nivel lo hace el servicio)
// Administrador: ve todas las de todos los niveles (o las de un nivel con ?nivel=ID)
// Atleta: solo las ACTIVAS de su nivel
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getCompetencia);

// UNA competencia por id (el controlador valida que el Atleta solo vea las activas de su nivel)
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getCompetencias);

// Crear competencia: solo el Administrador (elige el nivel en el formulario)
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createCompetencia);

// Actualizar competencia: solo el Administrador
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateCompetencia);

// Eliminar competencia: solo el Administrador
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteCompetencia);

export default router;