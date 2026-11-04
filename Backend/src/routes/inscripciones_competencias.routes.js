import { Router } from "express";
import { createInscripcion_competencia, deleteInscripcion_competencia, getInscripcion_competencia, getInscripciones_competencias, updateInscripcion_competencia } from "../controllers/inscripciones_competencias.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

// Inscribirse a una competencia: solo el Atleta
// El usuario sale del token y el controlador valida que la competencia sea de su nivel
router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createInscripcion_competencia);

// LISTA de inscripciones (el filtro por rol lo hace el servicio)
// Atleta: solo las suyas
// Administrador: todas
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getInscripcion_competencia);

// UNA inscripción por id (el controlador valida que el Atleta solo vea las suyas)
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getInscripciones_competencias);

// Actualizar una inscripción: solo el Administrador
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateInscripcion_competencia);

// Eliminar una inscripción: el Atleta (solo las suyas) o el Administrador (cualquiera)
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Atleta', 'Administrador'])], deleteInscripcion_competencia);

export default router;