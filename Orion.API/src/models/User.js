import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["ADMIN", "TECNICO", "LECTOR"],
      default: "LECTOR"
    },

    permissions: {
      type: [String],
      default: ["mantenimientos.read"]
    },

    provider: {
      type: String,
      enum: ["google", "local"],
      default: "google"
    },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
