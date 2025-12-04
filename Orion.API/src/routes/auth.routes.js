import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/reset", AuthController.solicitarCodigo);
router.post("/change-password", AuthController.cambiarPassword);

export default router;
