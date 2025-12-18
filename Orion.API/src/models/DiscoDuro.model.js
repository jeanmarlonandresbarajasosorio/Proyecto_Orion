import mongoose from "mongoose";

const DiscoDuroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    usuario_creacion: {
      type: String,
      default: "admin",
    },
  },
  {
    collection: "discos_duros",
  }
);

export default mongoose.model("DiscoDuro", DiscoDuroSchema);
