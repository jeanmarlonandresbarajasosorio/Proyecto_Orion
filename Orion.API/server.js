import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mantenimientosRoutes from "./src/routes/mantenimientos.js";
app.use("/api/mantenimientos", mantenimientosRoutes);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB(); 

app.use("/api/mantenimientos", mantenimientosRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
