import { Router } from "express";
import { createSolicitudImplementos, deleteSolicitudImplementos, getSolicitudImplementos, updateSolicitudImplementos } from "../controllers/solicitudImplementos.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router();

router.post('/', [authMiddleware, authorizationMiddleware(['Atleta'])], createSolicitudImplementos);
router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], getSolicitudImplementos);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deleteSolicitudImplementos);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Atleta'])], updateSolicitudImplementos);

export default router;