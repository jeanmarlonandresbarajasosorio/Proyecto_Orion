import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || null,
      permissions: decoded.permissions || []
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
