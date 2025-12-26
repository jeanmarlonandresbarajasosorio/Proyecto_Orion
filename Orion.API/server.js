import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/Config/db.js";

import authRoutes from "./src/routes/auth.routes.js"; 
import sedeRoutes from "./src/routes/sede.routes.js";
import sistemaOperativoRoutes from "./src/routes/sistemaOperativo.routes.js";
import tipoDispositivoRoutes from "./src/routes/tipoDispositivo.routes.js";
import tipoListaRoutes from "./src/routes/tipoLista.routes.js";
import listaChequeoRoutes from "./src/routes/listaChequeo.routes.js";
import funcionarioRoutes from "./src/routes/funcionario.routes.js";
import areaRoutes from "./src/routes/area.routes.js";
import mantenimientosRoutes from "./src/routes/mantenimientos.routes.js";
import discoDuroRoutes from "./src/routes/discoDuro.routes.js";
import memoriaRamRoutes from "./src/routes/memoriaRam.routes.js";
import procesadorRoutes from "./src/routes/procesador.routes.js";
import mongoose from "mongoose";
import testRoutes from "./src/routes/test.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import permissionsRoutes from "./src/routes/permissions.routes.js";

dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
// Se unificó la configuración de CORS y se colocó al inicio para que funcione correctamente
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());

// Rutas de AUTH
app.use("/api/auth", authRoutes);
app.set("mongoose", mongoose);
app.use("/api/users", usersRoutes);

// Rutas de prueba
app.use("/api/test", testRoutes);

// Rutas de módulos
app.use("/api/sedes", sedeRoutes);
app.use("/api/sistemas-operativos", sistemaOperativoRoutes);
app.use("/api/tipos-dispositivos", tipoDispositivoRoutes);
app.use("/api/tipos-lista", tipoListaRoutes);
app.use("/api/listas-chequeo", listaChequeoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/discos-duros", discoDuroRoutes);
app.use("/api/memorias-ram", memoriaRamRoutes);
app.use("/api/procesadores", procesadorRoutes);
app.use("/api/permissions", permissionsRoutes);

// Definir el puerto
const PORT = process.env.PORT || 5000;

// --- LO QUE FALTABA: Iniciar el servidor ---
// Escuchamos en '0.0.0.0' para que Docker pueda mapear el puerto correctamente
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Orion API corriendo en http://localhost:${PORT}`);
});