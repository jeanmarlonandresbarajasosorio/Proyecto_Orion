// src/controllers/tipoCambio.controller.js
import TipoCambio from "../models/TipoCambio.js";

/* ===============================
   OBTENER TODOS
================================ */
export const getTiposCambio = async (req, res) => {
  try {
    const data = await TipoCambio.find().sort({ fecha_creacion: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipos de cambio" });
  }
};

/* ===============================
   CREAR
================================ */
export const createTipoCambio = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nuevo = new TipoCambio({
      nombre,
      estado,
      usuario_creacion: req.user?.name || "system",
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tipo de cambio" });
  }
};

/* ===============================
   ACTUALIZAR
================================ */
export const updateTipoCambio = async (req, res) => {
  try {
    const updated = await TipoCambio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tipo de cambio" });
  }
};
