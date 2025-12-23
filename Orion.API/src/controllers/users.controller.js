import User from "../models/User.js";

/* ========================= */
/* GET ALL USERS */
/* ========================= */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

/* ========================= */
/* CREATE USER */
/* ========================= */
export const createUser = async (req, res) => {
  try {
    const { name, email, role, active } = req.body;

    //  Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({
        message: "Nombre y email son requeridos"
      });
    }

    //  Evitar duplicados
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "El email ya existe"
      });
    }

    //  Crear usuario alineado al MODELO
    const user = await User.create({
      name,
      email,
      role: role || "LECTOR",
      active: active ?? true,

      //  Campos obligatorios del modelo
      provider: "local",
      permissions: ["mantenimientos.read"]
    });

    res.status(201).json(user);

  } catch (error) {
    console.error("❌ Error creando usuario:", error);
    res.status(500).json({ message: "Error creando usuario" });
  }
};

/* ========================= */
/* UPDATE USER */
/* ========================= */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.json(user);

  } catch (error) {
    console.error("❌ Error actualizando usuario:", error);
    res.status(500).json({
      message: "Error actualizando usuario"
    });
  }
};

/* ========================= */
/* TOGGLE ACTIVE */
/* ========================= */
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    user.active = !user.active;
    await user.save();

    res.json(user);

  } catch (error) {
    console.error("❌ Error cambiando estado:", error);
    res.status(500).json({
      message: "Error cambiando estado"
    });
  }
};
