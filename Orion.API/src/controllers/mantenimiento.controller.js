import Mantenimiento from "../models/mantenimiento.model.js";

export const getAll = async (req, res) => {
  const data = await Mantenimiento.find().sort({ createdAt: -1 });
  res.json(data);
};

export const create = async (req, res) => {
  const nuevo = new Mantenimiento(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const actualizado = await Mantenimiento.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(actualizado);
};

export const remove = async (req, res) => {
  await Mantenimiento.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
