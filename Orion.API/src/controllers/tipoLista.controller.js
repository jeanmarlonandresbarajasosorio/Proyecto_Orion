import TipoLista from "../models/tipoLista.model.js";

export const getTiposLista = async (req, res) => {
  try {
    const data = await TipoLista.find().sort({ fecha_creacion: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTipoListaById = async (req, res) => {
  try {
    const item = await TipoLista.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "No encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTipoLista = async (req, res) => {
  try {
    const nuevo = new TipoLista({
      nombre: req.body.nombre,
      estado: req.body.estado ?? true,
      usuario_creacion: "admin",
    });

    const saved = await nuevo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTipoLista = async (req, res) => {
  try {
    const updated = await TipoLista.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        estado: req.body.estado,
        fecha_modificacion: new Date(),
        usuario_modifica: "admin",
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "No encontrado" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
