import { Router } from "express";
import { createJustificacion, deleteJustificacion, getJustificacion, updateJustificacion } from "../controllers/justificacion.controllers.js";

const router = Router();

// Define las rutas para justificaciones
router.post('/', createJustificacion);
router.get('/', getJustificacion);
router.delete('/:id', deleteJustificacion);
router.patch('/:id', updateJustificacion);

// Exportar las rutas definidas en este archivo
export default router;
