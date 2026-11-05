import { Router } from "express";
import { createSolicitud, getSolicitud, updateSolicitud } from "../controllers/solicitud.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createSolicitud);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getSolicitud);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Atleta', 'Administrador'])], updateSolicitud);

export default router;