import Mantenimiento from "../models/Mantenimiento.js";

// GET all
export const getMantenimientos = async (req, res) => {
  try {
    const data = await Mantenimiento.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET by ID
export const getMantenimiento = async (req, res) => {
  try {
    const data = await Mantenimiento.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "No encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create
export const createMantenimiento = async (req, res) => {
  try {
    const nuevo = new Mantenimiento(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update
export const updateMantenimiento = async (req, res) => {
  try {
    const actualizado = await Mantenimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteMantenimiento = async (req, res) => {
  try {
    await Mantenimiento.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
