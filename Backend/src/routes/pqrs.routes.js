import { Router } from "express";
import { createPqrs, getpqrs, getPqrs, updatePqrs } from "../controllers/pqrs.crontrollers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createPqrs );
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getPqrs);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updatePqrs);
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getpqrs);

export default router;