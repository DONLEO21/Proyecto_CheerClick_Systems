import { Router } from "express";
import { createPlantillahorario, deletePlantillahorario, getPlantillahorario, getPlantillahorarios, updatePlantillahorario } from "../controllers/plantilla_horarios.controllers.js";

const router = Router(); // Crear una instancia de las rutas de express

// Define las rutas para la plantilla_hoarios



router.get('/', getPlantillahorario);
router.post('/', createPlantillahorario);
// router.put('/', updatePlantillahorarioPut);
router.patch('/:id', updatePlantillahorario);
router.delete('/:id', deletePlantillahorario);
router.get('/:id',getPlantillahorarios )

// Exportar las rutas definidas en este archivo
export default router;