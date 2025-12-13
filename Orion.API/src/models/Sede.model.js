import mongoose from "mongoose";

const SedeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: Boolean, default: true },

  fecha_creacion: { type: Date, default: Date.now },
  usuario_creacion: { type: String, default: "admin" },

  fecha_modificacion: { type: Date, default: null },
  usuario_modifica: { type: String, default: null }
});

export default mongoose.model("Sede", SedeSchema);
