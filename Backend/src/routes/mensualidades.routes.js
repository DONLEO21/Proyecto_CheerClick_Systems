import { Router } from "express";
import { CreateMensualidad, DeleteMensualidad, GetMensualidad, GetMensualidades, UpdateMensualidad } from "../controllers/mensualidades.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middlewares.js";


const router = Router(); //Crear una instancia de las rutas de express

//Define las rutas para las mensualidades 

router.post('/',[authMiddleware, authorizationMiddleware(['Administrador'])], CreateMensualidad);

router.get('/', [authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], GetMensualidad);

router.get('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], GetMensualidades);

// router.put('/', );

router.patch('/:id',[authMiddleware, authorizationMiddleware(['Administrador', 'Atleta'])], UpdateMensualidad );

router.delete('/:id',[authMiddleware, authorizationMiddleware(['Administrador'])], DeleteMensualidad );



//Exportar las rutas definidas de este archivo

export default router;