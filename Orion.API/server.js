import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import sedeRoutes from "./src/routes/sede.routes.js";
import sistemaOperativoRoutes from "./src/routes/sistemaOperativo.routes.js";
import tipoDispositivoRoutes from "./src/routes/tipoDispositivo.routes.js";
import tipoListaRoutes from "./src/routes/tipoLista.routes.js";
import listaChequeoRoutes from "./src/routes/listaChequeo.routes.js";
import funcionarioRoutes from "./src/routes/funcionario.routes.js";
import areaRoutes from "./src/routes/area.routes.js";
import mantenimientosRoutes from "./src/routes/mantenimientos.routes.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/sedes", sedeRoutes);
app.use("/api/sistemas-operativos", sistemaOperativoRoutes);
app.use("/api/tipos-dispositivos", tipoDispositivoRoutes);
app.use("/api/tipos-lista", tipoListaRoutes);
app.use("/api/listas-chequeo", listaChequeoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);

// 🔹 Mongo
//mongoose
 // .connect("mongodb://127.0.0.1:27017/orion")
 // .then(() => console.log("✅ MongoDB conectado"))
 // .catch(err => console.error(err));

//app.listen(3000, () =>
 // console.log("🚀 Backend corriendo en http://localhost:3000")

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 API Orion en puerto ${PORT}`)
);
