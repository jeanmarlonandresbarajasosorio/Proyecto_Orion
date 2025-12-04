import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";   // ESTA ES LA RUTA CORRECTA
import authRoutes from "./src/routes/index.js";

dotenv.config();

// Conexión a MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
