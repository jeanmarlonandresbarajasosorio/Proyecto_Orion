import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(403).json({ message: "Token requerido" });

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.usuario = usuario;
    next();
  });
};
