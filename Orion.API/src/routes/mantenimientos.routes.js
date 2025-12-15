import express from "express";
import Mantenimiento from "../models/Mantenimiento.js";

const router = express.Router();

// 🔹 GET todos
router.get("/", async (req, res) => {
  const data = await Mantenimiento.find().sort({ createdAt: -1 });
  res.json(data);
});

// 🔹 GET por ID
router.get("/:id", async (req, res) => {
  const item = await Mantenimiento.findById(req.params.id);
  res.json(item);
});

// 🔹 POST crear
router.post("/", async (req, res) => {
  const nuevo = new Mantenimiento(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// 🔹 PUT actualizar
router.put("/:id", async (req, res) => {
  const actualizado = await Mantenimiento.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizado);
});

// 🔹 DELETE
router.delete("/:id", async (req, res) => {
  await Mantenimiento.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
