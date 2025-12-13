import mongoose from "mongoose";

const SistemaOperativoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    estado: { type: Boolean, default: true },

    fecha_creacion: { type: Date, default: Date.now },
    usuario_creacion: { type: String, default: "admin" },

    fecha_modificacion: { type: Date },
    usuario_modifica: { type: String },
  },
  { collection: "sistemas_operativos" }
);

export default mongoose.model(
  "SistemaOperativo",
  SistemaOperativoSchema
);
