import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/Config/db.js";

/* ===============================
   IMPORTACIÓN DE RUTAS
================================ */
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import permissionsRoutes from "./src/routes/permissions.routes.js";

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
import tipoEntregaRoutes from "./src/routes/tipoEntrega.routes.js";

import testRoutes from "./src/routes/test.routes.js";

dotenv.config();

const app = express();

/* ===============================
   CONEXIÓN BD
================================ */
connectDB();
app.set("mongoose", mongoose);

/* ===============================
   MIDDLEWARES
================================ */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   RUTAS
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/test", testRoutes);

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
app.use("/api/tipos-entrega", tipoEntregaRoutes);

/* ===============================
   ARRANQUE SERVIDOR
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Orion API corriendo en puerto ${PORT}`);
});
