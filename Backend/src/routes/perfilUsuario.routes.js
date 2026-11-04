import { Router } from "express";
import { createPerfilUsuario, getPerfilUsuario, updatePerfilUsuario, deletePerfilUsuario} from "../controllers/perfilUsuario.controllers.js";
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware.middleware.js'
import { authMiddleware} from '../middlewares/authenticate.middlewares.js'

const router = Router(); 

router.post('/', [ authMiddleware , authorizationMiddleware], createPerfilUsuario);
router.get('/:id', getPerfilUsuario);
router.patch('/:id', updatePerfilUsuario);
router.delete('/:id', deletePerfilUsuario);

//Exportar las rutas definidas en este archivo
export default router;