import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: Boolean, default: true },

  fecha_creacion: { type: Date, default: Date.now },
  usuario_creacion: { type: String },

  fecha_modificacion: { type: Date },
  usuario_modifica: { type: String },
});

export default mongoose.model("Area", AreaSchema);
