import { Router } from "express";
import { verificarToken } from "Orion.SHARED/src/helpers/verifyToken.js";
import { verificarRol } from "Orion.SHARED/src/helpers/verifyRole.js";

const router = Router();

router.get(
  "/solo-admin",
  verificarToken,
  verificarRol(["Admin"]),
  (req, res) => res.json({ message: "Bienvenido administrador" })
);

router.get(
  "/usuario",
  verificarToken,
  (req, res) => res.json({ message: "Ruta de usuario" })
);

export default router;
