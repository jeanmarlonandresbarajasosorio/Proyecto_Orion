import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Permission from "../models/Permission.js";

const router = Router();

/* ============================= */
/*  GOOGLE LOGIN */
/* ============================= */
router.post("/google", async (req, res) => {
  try {
    const { name, email, picture } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    /* ===================================== */
    /*  VALIDAR PERMISO ANTES DE TODO */
    /* ===================================== */
    const permission = await Permission.findOne({ email });

    if (!permission || !permission.allowed) {
      return res.status(401).json({
        message: "Este correo no tiene permiso para acceder al sistema",
      });
    }

    /* ===================================== */
    /*  BUSCAR USUARIO */
    /* ===================================== */
    let user = await User.findOne({ email });

    /* ===================================== */
    /*  CREAR USUARIO SI NO EXISTE */
    /* ===================================== */
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        role: "LECTOR", // rol por defecto
        active: true,
      });
    }

    /* ===================================== */
    /*  USUARIO INACTIVO */
    /* ===================================== */
    if (!user.active) {
      return res.status(403).json({
        message: "Usuario inactivo. Contacte al administrador",
      });
    }

    /* ===================================== */
    /*  GENERAR TOKEN */
    /* ===================================== */
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    /* ===================================== */
    /*  RESPUESTA */
    /* ===================================== */
    res.json({
      token,
      user,
    });

  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);
    res.status(500).json({ message: "Error autenticando" });
  }
});

export default router;
