console.log("✅ Permissions routes loaded");
import { Router } from "express";
import Permission from "../models/Permission.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";

const router = Router();

/* ===========================
   GET ALL PERMISSIONS
=========================== */
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const permissions = await Permission.find().sort({ createdAt: -1 });
    res.json(permissions);
  }
);

/* ===========================
   CREATE PERMISSION
=========================== */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    const exists = await Permission.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "El permiso ya existe" });
    }

    const permission = await Permission.create({
      email,
      allowed: true,
    });

    res.status(201).json(permission);
  }
);

/* ===========================
   UPDATE PERMISSION
=========================== */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(permission);
  }
);

/* ===========================
   TOGGLE PERMISSION
=========================== */
router.patch(
  "/:id/toggle",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    permission.allowed = !permission.allowed;
    await permission.save();

    res.json(permission);
  }
);

/* ===========================
   DELETE PERMISSION
=========================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    await Permission.findByIdAndDelete(req.params.id);
    res.json({ message: "Permiso eliminado" });
  }
);

export default router;
