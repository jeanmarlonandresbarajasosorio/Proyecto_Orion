import DiscoDuro from "../models/DiscoDuro.model.js";

/* ===========================
   OBTENER TODOS
=========================== */
export const getDiscos = async (req, res) => {
  try {
    const discos = await DiscoDuro.find().sort({ nombre: 1 });
    res.json(discos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   CREAR
=========================== */
export const createDisco = async (req, res) => {
  try {
    const { nombre, usuario_creacion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: "El nombre es obligatorio",
      });
    }

    const nuevo = new DiscoDuro({
      nombre,
      estado: true,
      fecha_creacion: new Date(),
      usuario_creacion,
    });

    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   ACTUALIZAR
=========================== */
export const updateDisco = async (req, res) => {
  try {
    const { nombre, usuario_modifica } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: "El nombre es obligatorio",
      });
    }

    const updated = await DiscoDuro.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        fecha_modificacion: new Date(),
        usuario_modifica,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
