import Permission from "../models/Permission.js";

export const checkPermission = async (req, res, next) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({ message: "Usuario no identificado" });
    }

    const permission = await Permission.findOne({ email });

    if (!permission || permission.allowed === false) {
      return res.status(403).json({
        message: "Acceso bloqueado por el administrador"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error validando permisos"
    });
  }
};
