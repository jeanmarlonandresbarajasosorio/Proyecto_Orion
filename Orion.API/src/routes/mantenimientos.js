const express = require("express");
const router = express.Router();
const Mantenimiento = require("../models/Mantenimiento");

// Obtener todos
router.get("/", async (req, res) => {
  const data = await Mantenimiento.find().sort({ createdAt: -1 });
  res.json(data);
});

// Crear
router.post("/", async (req, res) => {
  const nuevo = new Mantenimiento(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// Editar
router.put("/:id", async (req, res) => {
  const editado = await Mantenimiento.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(editado);
});

// Eliminar
router.delete("/:id", async (req, res) => {
  await Mantenimiento.findByIdAndDelete(req.params.id);
  res.json({ message: "Eliminado" });
});

module.exports = router;
