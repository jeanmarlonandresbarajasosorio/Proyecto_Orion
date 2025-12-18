import mongoose from "mongoose";

const ProcesadorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    fecha_creacion: {
      type: Date,
      default: null,
    },

    usuario_creacion: {
      type: String,
      default: null,
    },

    fecha_modificacion: {
      type: Date,
      default: null,
    },

    usuario_modifica: {
      type: String,
      default: null,
    },
  },
  {
    collection: "procesadores",
  }
);

export default mongoose.model("Procesador", ProcesadorSchema);
