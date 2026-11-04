import { Router } from "express";
import { createAsistencia, deleteAsistencia, getAsistencia, updateAsistencia } from "../controllers/asistencia.controllers.js";

const router = Router();

// Define las rutas para asistencias
router.post('/', createAsistencia);
router.get('/', getAsistencia);
router.delete('/:id', deleteAsistencia);
router.patch('/:id', updateAsistencia);

// Exportar las rutas definidas en este archivo
export default router;
