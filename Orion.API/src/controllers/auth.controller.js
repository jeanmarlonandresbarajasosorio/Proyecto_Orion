import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Permission from "../models/Permission.js";

const router = Router();

router.post("/google", async (req, res) => {
  try {
    const { name, email, picture } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    // ✅ NORMALIZAR EMAIL
    const normalizedEmail = email.toLowerCase().trim();

    /* ============================= */
    /*  VALIDAR PERMISO DE ACCESO   */
    /* ============================= */
    const permission = await Permission.findOne({
      email: normalizedEmail,
    });

    if (!permission || permission.allowed === false) {
      return res.status(403).json({
        message: "Tu acceso ha sido bloqueado por el administrador",
      });
    }

    /* ============================= */
    /*  BUSCAR / CREAR USUARIO      */
    /* ============================= */
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        picture,
        role: "LECTOR",
        active: true,
      });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    /* ============================= */
    /*  GENERAR TOKEN               */
    /* ============================= */
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);
    res.status(500).json({ message: "Error autenticando" });
  }
});

export default router;
