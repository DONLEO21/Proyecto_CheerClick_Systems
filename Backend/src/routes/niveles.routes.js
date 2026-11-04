import { Router } from "express";
import { createNivel, getNivel, getNiveles, updateNivel } from "../controllers/niveles.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getNivel);
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createNivel);
// Para "Inhabilitar" se usa este PATCH enviando { "estado": "Inactivo" }
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateNivel);
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getNiveles);

export default router;
