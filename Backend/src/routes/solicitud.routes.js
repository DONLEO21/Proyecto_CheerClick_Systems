import { Router } from "express";
import { createSolicitud, deleteSolicitud, getSolicitud, updateSolicitud } from "../controllers/solicitud.controllers.js";

const router = Router();

router.post('/', createSolicitud);
router.get('/', getSolicitud);
router.delete('/:id', deleteSolicitud);
router.patch('/:id', updateSolicitud);

export default router;