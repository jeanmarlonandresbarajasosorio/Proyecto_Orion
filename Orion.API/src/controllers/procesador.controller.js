import Procesador from "../models/procesador.model.js";

// 📌 GET ALL
export const getProcesadores = async (req, res) => {
  try {
    const data = await Procesador.find().sort({ fecha_creacion: -1 });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo procesadores" });
  }
};

// 📌 POST
export const createProcesador = async (req, res) => {
  try {
    const nuevo = new Procesador(req.body);
    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando procesador" });
  }
};

// 📌 PUT
export const updateProcesador = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Procesador.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Procesador no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando procesador" });
  }
};
