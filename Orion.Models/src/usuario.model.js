import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ["Admin", "User"], default: "User" }
  },
  { timestamps: true }
);

export const Usuario = mongoose.model("Usuario", UsuarioSchema);
