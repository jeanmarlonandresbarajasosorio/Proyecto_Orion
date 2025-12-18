import MemoriaRam from "../models/memoriaRam.model.js";

/* ===================== */
/* GET ALL               */
/* ===================== */
export const getMemoriasRam = async (req, res) => {
  try {
    const memorias = await MemoriaRam.find().sort({ fecha_creacion: -1 });
    res.json(memorias);
  } catch (error) {
    res.status(500).json({ message: "Error cargando memorias RAM" });
  }
};

/* ===================== */
/* CREATE                */
/* ===================== */
export const createMemoriaRam = async (req, res) => {
  try {
    const { nombre, fecha_creacion, usuario_creacion } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nueva = new MemoriaRam({
      nombre,
      fecha_creacion,
      usuario_creacion,
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===================== */
/* UPDATE                */
/* ===================== */
export const updateMemoriaRam = async (req, res) => {
  try {
    const { nombre, fecha_modificacion, usuario_modifica } = req.body;

    const actualizada = await MemoriaRam.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        fecha_modificacion,
        usuario_modifica,
      },
      { new: true }
    );

    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
