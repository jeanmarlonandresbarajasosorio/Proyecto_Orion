import TipoEntrega from "../models/TipoEntrega.js";

/* =========================
   GET - listar todos
========================= */
export const getAll = async (req, res) => {
  try {
    const tipos = await TipoEntrega.find().sort({ fecha_creacion: -1 });
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tipos de entrega" });
  }
};

/* =========================
   POST - crear
========================= */
export const create = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const existe = await TipoEntrega.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(409).json({ message: "El tipo de entrega ya existe" });
    }

    const nuevo = new TipoEntrega({
      nombre: nombre.trim(),
      estado: estado ?? true,
      usuario_creacion: req.user?.email || "SYSTEM",
    });

    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear tipo de entrega" });
  }
};

/* =========================
   PUT - actualizar
========================= */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const updated = await TipoEntrega.findByIdAndUpdate(
      id,
      { nombre, estado },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tipo de entrega no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar tipo de entrega" });
  }
};
