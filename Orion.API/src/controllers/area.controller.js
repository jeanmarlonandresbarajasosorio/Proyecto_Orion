import Area from "../models/area.model.js";

// 🔹 GET
export const getAreas = async (req, res) => {
  try {
    const data = await Area.find().sort({ fecha_creacion: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 POST
export const createArea = async (req, res) => {
  try {
    const nueva = new Area({
      nombre: req.body.nombre,
      estado: true,
      usuario_creacion: "admin",
    });

    const guardada = await nueva.save();
    res.status(201).json(guardada); // 🔥 devuelve _id
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 PUT
export const updateArea = async (req, res) => {
  try {
    const actualizada = await Area.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        estado: req.body.estado,
        fecha_modificacion: new Date(),
        usuario_modifica: "admin",
      },
      { new: true }
    );

    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
