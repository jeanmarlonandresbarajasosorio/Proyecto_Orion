import Sede from "../models/Sede.model.js";

export const getAll = async (req, res) => {
  const sedes = await Sede.find().sort({ fecha_creacion: -1 });
  res.json(sedes);
};

export const create = async (req, res) => {
  const sede = new Sede(req.body);
  await sede.save();
  res.status(201).json(sede);
};

export const update = async (req, res) => {
  const sede = await Sede.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      fecha_modificacion: new Date(),
      usuario_modifica: "admin"
    },
    { new: true }
  );
  res.json(sede);
};

export const remove = async (req, res) => {
  await Sede.findByIdAndDelete(req.params.id);
  res.json({ message: "Sede eliminada" });
};
