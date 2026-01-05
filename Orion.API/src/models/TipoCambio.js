import mongoose from "mongoose";

const TipoCambioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,       
    },
    estado: {
      type: Boolean,
      default: true,
    },
    usuario_creacion: {
      type: String,
      default: "system",
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "tipos_cambio",
  }
);

export default mongoose.model("TipoCambio", TipoCambioSchema);
