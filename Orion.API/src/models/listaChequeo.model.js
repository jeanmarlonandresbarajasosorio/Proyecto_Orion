import mongoose from "mongoose";

const ListaChequeoSchema = new mongoose.Schema(
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
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    usuario_creacion: {
      type: String,
      default: "admin",
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
    collection: "listas_chequeo",
  }
);

export default mongoose.model("ListaChequeo", ListaChequeoSchema);
