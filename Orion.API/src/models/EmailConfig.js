import mongoose from "mongoose";

const EmailConfigSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correos: [{ type: String, required: true }],
  asunto: { type: String, required: true },
  mensaje: { type: String, required: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("EmailConfig", EmailConfigSchema);
