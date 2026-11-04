import { Router } from "express";
import { createSolicitudImplementos, deleteSolicitudImplementos, getSolicitudImplementos, updateSolicitudImplementos } from "../controllers/solicitudImplementos.controllers.js";

const router = Router();

router.post('/', createSolicitudImplementos);
router.get('/', getSolicitudImplementos);
router.delete('/:id', deleteSolicitudImplementos);
router.patch('/:id', updateSolicitudImplementos);

export default router;