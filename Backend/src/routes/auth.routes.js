import { Router } from "express";
import {createUsuario} from '../controllers/usuarios.controllers.js'
import { loginUser, verifyAuthenticate } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware.js";
import { withRoleMiddleware } from "../middlewares/withrout.middleware.js";

const router = Router();

// 1. Registro publico de usuarios (default: CUSTOMER) Middleware asegurarme que solo se registre CUSTOMER
router.post( '/register', withRoleMiddleware, createUsuario);     

// 2. Login de usuarios
router.post( '/login', loginUser );

// 3. Renovación de Credenciales (Token)
router.get( '/renew-token', authMiddleware, verifyAuthenticate );

// Investigarrr
// 4. Recuperar Contraseña
// 5. Habilitar cuenta regustrada publicamente

export default router;