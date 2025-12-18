import express from "express";
import DiscoDuro from "../models/DiscoDuro.model.js";

const router = express.Router();

/* ===================== */
/* GET ALL               */
/* ===================== */
router.get("/", async (req, res) => {
  try {
    const discos = await DiscoDuro.find().sort({ createdAt: -1 });
    res.json(discos);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo discos duros" });
  }
});

/* ===================== */
/* CREATE                */
/* ===================== */
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nuevo = new DiscoDuro({ nombre });
    await nuevo.save();

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ===================== */
/* UPDATE                */
/* ===================== */
router.put("/:id", async (req, res) => {
  try {
    const { nombre } = req.body;

    const actualizado = await DiscoDuro.findByIdAndUpdate(
      req.params.id,
      { nombre },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
