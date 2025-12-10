import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/orion_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔥 Conectado a MongoDB en localhost:27017");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
