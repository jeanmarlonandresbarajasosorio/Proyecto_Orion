import TipoDispositivo from "../models/TipoDispositivo.model.js";

export const getAll = async (req, res) => {
  try {
    const data = await TipoDispositivo.find().sort({ fecha_creacion: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const nuevo = new TipoDispositivo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const actualizado = await TipoDispositivo.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        fecha_modificacion: new Date(),
        usuario_modifica: "admin",
      },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
