import mongoose from "mongoose";

const memoriaRamSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    fecha_creacion: {
      type: Date,
    },

    usuario_creacion: {
      type: String,
    },

    fecha_modificacion: {
      type: Date,
    },

    usuario_modifica: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("MemoriaRam", memoriaRamSchema);
