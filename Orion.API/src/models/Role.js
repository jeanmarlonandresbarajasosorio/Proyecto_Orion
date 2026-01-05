import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    permissions: [
      {
        module: String,
        actions: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
