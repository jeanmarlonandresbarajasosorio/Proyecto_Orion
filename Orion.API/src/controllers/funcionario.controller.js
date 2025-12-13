import Funcionario from "../models/funcionario.model.js";

// GET
export const getFuncionarios = async (req, res) => {
  const data = await Funcionario.find().sort({ fecha_creacion: -1 });
  res.json(data);
};

// POST
export const createFuncionario = async (req, res) => {
  try {
    const nuevo = new Funcionario({
      nombre: req.body.nombre,
      estado: true,
      usuario_creacion: "admin",
    });

    const guardado = await nuevo.save();
    res.status(201).json(guardado); // 🔥 devuelve _id
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT
export const updateFuncionario = async (req, res) => {
  try {
    const actualizado = await Funcionario.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        estado: req.body.estado,
        fecha_modificacion: new Date(),
        usuario_modifica: "admin",
      },
      { new: true }
    );

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
