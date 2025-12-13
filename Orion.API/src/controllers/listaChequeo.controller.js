import ListaChequeo from "../models/listaChequeo.model.js";

// GET
export const getListasChequeo = async (req, res) => {
  const data = await ListaChequeo.find().sort({ fecha_creacion: -1 });
  res.json(data);
};

// POST
export const createListaChequeo = async (req, res) => {
  try {
    const nuevo = new ListaChequeo({
      nombre: req.body.nombre,
      estado: true,
      fecha_creacion: new Date(),
      usuario_creacion: "admin",
    });

    const guardado = await nuevo.save();

    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT
export const updateListaChequeo = async (req, res) => {
  try {
    const actualizado = await ListaChequeo.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        estado: req.body.estado,
        fecha_modificacion: new Date(),
        usuario_modifica: "admin",
      },
      { new: true } // 🔥 OBLIGATORIO
    );

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
