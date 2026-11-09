import { Router } from "express";
import {createUsuario} from '../controllers/usuarios.controllers.js'
import { loginUser, verifyAuthenticate, forgotPassword, verifyCode, resetPassword } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
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

router.post( '/forgot-password', forgotPassword );   // Paso 1: ingresar correo, se envía el código
router.post( '/resend-code', forgotPassword );       // Reenviar código (misma lógica, genera uno nuevo)
router.post( '/verify-code', verifyCode );           // Paso 2: ingresar el código
router.post( '/reset-password', resetPassword );     // Paso 3: nueva contraseña
// 5. Habilitar cuenta regustrada publicamente

export default router;