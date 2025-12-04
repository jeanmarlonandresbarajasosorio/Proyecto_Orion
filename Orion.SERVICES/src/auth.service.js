import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createToken, createRefreshToken } from "../helpers/token.helper.js";

class AuthService {

  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      const existe = await User.findOne({ email });
      if (existe) return res.status(400).json({ message: "Email ya registrado" });

      const hash = bcrypt.hashSync(password, 10);

      await User.create({ nombre, email, password: hash });

      res.json({ message: "Usuario creado correctamente" });

    } catch (e) {
      res.status(500).json({ message: "Error en registro" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "Usuario no existe" });

      const valido = bcrypt.compareSync(password, user.password);
      if (!valido) return res.status(400).json({ message: "Contraseña incorrecta" });

      const token = createToken(user);
      const refresh = createRefreshToken(user);

      res.json({ token, refresh });

    } catch (e) {
      res.status(500).json({ message: "Error en login" });
    }
  }

  async resetPassword(req, res) {
    res.json({ message: "Código enviado (simulado)" });
  }

  async changePassword(req, res) {
    res.json({ message: "Contraseña cambiada" });
  }
}

export default new AuthService();
