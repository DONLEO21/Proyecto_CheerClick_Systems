import { Router } from "express";
import { CreateMensualidad, DeleteMensualidad, GetMensualidad, GetMensualidades, UpdateMensualidad } from "../controllers/mensualidades.controllers.js";



const router = Router(); //Crear una instancia de las rutas de express

//Define las rutas para las mensualidades 

router.post('/', CreateMensualidad);

router.get('/', GetMensualidad);

router.get('/:id', GetMensualidades);

// router.put('/', );

router.patch('/:id', UpdateMensualidad );

router.delete('/:id', DeleteMensualidad );



//Exportar las rutas definidas de este archivo

export default router;