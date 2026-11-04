import { Router } from "express";
import { createSolicitud, deleteSolicitud, getSolicitud, updateSolicitud } from "../controllers/solicitud.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createSolicitud);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getSolicitud);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteSolicitud);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Atleta'])], updateSolicitud);

export default router;