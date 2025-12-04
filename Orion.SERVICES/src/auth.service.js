import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Usuario } from "Orion.Models/src/Usuario.model.js";
import { generarToken } from "Orion.SHARED/src/helpers/jwt.helper.js";

export class AuthService {

  // REGISTRO
  async register(data) {
    const existe = await Usuario.findOne({ email: data.email });
    if (existe) return null;

    const hash = await bcrypt.hash(data.password, 10);

    const nuevo = new Usuario({
      nombre: data.nombre,
      email: data.email,
      passwordHash: hash,
      rol: data.rol || "User"
    });

    await nuevo.save();

    return nuevo;
  }

  // LOGIN
  async login(email, password) {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return null;

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) return null;

    const token = generarToken(usuario);
    const refresh = jwt.sign({ id: usuario._id }, process.env.JWT_REFRESH, { expiresIn: "7d" });

    return { token, refresh, usuario };
  }

  // REFRESH TOKEN
  async refreshToken(token) {
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH);

      const usuario = await Usuario.findById(data.id);
      if (!usuario) return null;

      return generarToken(usuario);

    } catch {
      return null;
    }
  }

  // RECUPERACIÓN DE CONTRASEÑA
  async generarCodigoRecuperacion(email) {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return null;

    const codigo = crypto.randomInt(100000, 999999).toString();

    usuario.resetCode = codigo;
    usuario.resetExpiration = Date.now() + 1000 * 60 * 10; // 10 minutos
    await usuario.save();

    return codigo; // Se enviaría por correo
  }

  async cambiarPassword(email, codigo, nuevaPassword) {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return null;

    if (usuario.resetCode !== codigo) return "codigo_invalido";
    if (usuario.resetExpiration < Date.now()) return "expirado";

    usuario.passwordHash = await bcrypt.hash(nuevaPassword, 10);
    usuario.resetCode = null;
    usuario.resetExpiration = null;
    await usuario.save();

    return true;
  }
}
