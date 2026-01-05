import mongoose from "mongoose";

const TipoEntregaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    usuario_creacion: {
      type: String,
      default: "SYSTEM",
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("TipoEntrega", TipoEntregaSchema);
