import { Router } from "express";
import { registerUsuario, loginUser, verifyAuthenticate, forgotPassword, verifyCode, resetPassword } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/authenticate.middlewares.js";
import { withRoleMiddleware } from "../middlewares/withrout.middleware.js";
import { loginLimiter, registerLimiter, forgotLimiter, resetLimiter } from "../middlewares/rateLimit.middlewares.js";

const router = Router();

// 1. Registro publico de usuarios (default: Atleta)
router.post( '/register', registerLimiter, withRoleMiddleware, registerUsuario );

// 2. Login de usuarios
router.post( '/login', loginLimiter, loginUser );

// 3. Renovación de Credenciales (Token) -> ya exige token, sin límite
router.get( '/renew-token', authMiddleware, verifyAuthenticate );

// 4. Recuperar Contraseña (3 pasos)
router.post( '/forgot-password', forgotLimiter, forgotPassword );
router.post( '/resend-code', forgotLimiter, forgotPassword );
router.post( '/verify-code', resetLimiter, verifyCode );
router.post( '/reset-password', resetLimiter, resetPassword );

// 5. Habilitar cuenta regustrada publicamente

export default router;