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

    /*  VALIDAR PERMISO */
    const permission = await Permission.findOne({ email });

    if (!permission || !permission.allowed) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        role: "LECTOR",
        active: true,
      });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);
    res.status(500).json({ message: "Error autenticando" });
  }
});

export default router;
