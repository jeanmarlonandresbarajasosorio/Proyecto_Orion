import { AuthService } from "Orion.SERVICES/src/auth.service.js";
const servicio = new AuthService();

export const AuthController = {

  async register(req, res) {
    const usuario = await servicio.register(req.body);
    if (!usuario) return res.status(400).json({ message: "El email ya existe" });
    res.json({ message: "Usuario registrado con éxito" });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const result = await servicio.login(email, password);

    if (!result) return res.status(401).json({ message: "Credenciales inválidas" });

    res.json({
      token: result.token,
      refresh: result.refresh,
      usuario: {
        id: result.usuario._id,
        nombre: result.usuario.nombre,
        email: result.usuario.email,
        rol: result.usuario.rol
      }
    });
  },

  async refresh(req, res) {
    const token = req.body.refresh;
    const nuevoToken = await servicio.refreshToken(token);
    if (!nuevoToken) return res.status(401).json({ message: "Refresh inválido" });

    res.json({ token: nuevoToken });
  },

  async solicitarCodigo(req, res) {
    const codigo = await servicio.generarCodigoRecuperacion(req.body.email);
    if (!codigo) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Código generado", codigo });
  },

  async cambiarPassword(req, res) {
    const { email, codigo, nuevaPassword } = req.body;

    const resp = await servicio.cambiarPassword(email, codigo, nuevaPassword);

    if (resp === "codigo_invalido")
      return res.status(400).json({ message: "Código incorrecto" });

    if (resp === "expirado")
      return res.status(400).json({ message: "El código expiró" });

    res.json({ message: "Contraseña actualizada" });
  }
};
