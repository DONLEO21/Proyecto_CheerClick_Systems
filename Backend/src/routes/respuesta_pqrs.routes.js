import { Router } from "express";
import { createRespuesta_pqrs, deleteRespuesta_pqrs, getrespuesta_pqrs, getRespuesta_pqrs, updateRespuesta_pqrs } from "../controllers/respuesta_pqrs.crontrollers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/',  [authMiddleware, authorizationMiddleware(['Administrador'])], createRespuesta_pqrs);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getRespuesta_pqrs);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteRespuesta_pqrs);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updateRespuesta_pqrs );
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getrespuesta_pqrs);

export default router;