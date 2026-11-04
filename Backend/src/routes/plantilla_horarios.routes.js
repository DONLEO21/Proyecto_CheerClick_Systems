import { Router } from "express";
import { createPlantillahorario, deletePlantillahorario, getPlantillahorario, getPlantillahorarios, updatePlantillahorario } from "../controllers/plantilla_horarios.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";

const router = Router(); // Crear una instancia de las rutas de express

router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getPlantillahorario);
router.post('/', [authMiddleware, authorizationMiddleware(['Administrador'])], createPlantillahorario);
// router.put('/', updatePlantillahorarioPut);
router.patch('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], updatePlantillahorario);
router.delete('/:id', [authMiddleware, authorizationMiddleware(['Administrador'])], deletePlantillahorario);
router.get('/:id', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta', 'Entrenador'])], getPlantillahorarios )

// Exportar las rutas definidas en este archivo
export default router;