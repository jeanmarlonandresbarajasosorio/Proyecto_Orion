import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
    },
    actions: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Permission", PermissionSchema);
