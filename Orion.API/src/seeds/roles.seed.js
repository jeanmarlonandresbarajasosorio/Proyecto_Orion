import mongoose from "mongoose";
import dotenv from "dotenv";

import Role from "../models/Role.js";
import Permission from "../models/Permission.js";

dotenv.config();

/* ========================= */
/* CONEXIÓN MONGODB          */
/* ========================= */
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI no está definida en el .env");
  process.exit(1);
}

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("🟢 MongoDB conectado");
};

/* ========================= */
/* PRESETS DE PERMISOS       */
/* ========================= */
const PERMISSIONS = [
  { module: "dashboard", actions: ["read"] },
  { module: "mantenimientos", actions: ["read", "create", "update"] },
  { module: "maestros", actions: ["read"] },
  { module: "usuarios", actions: ["read"] },
  { module: "roles", actions: ["read"] },
];

const ROLES = [
  {
    name: "ADMIN",
    permissions: [
      { module: "*", actions: ["*"] },
    ],
  },
  {
    name: "TECNICO",
    permissions: [
      { module: "dashboard", actions: ["read"] },
      { module: "mantenimientos", actions: ["read", "create", "update"] },
      { module: "maestros", actions: ["read"] },
    ],
  },
  {
    name: "LECTOR",
    permissions: [
      { module: "dashboard", actions: ["read"] },
      { module: "mantenimientos", actions: ["read"] },
    ],
  },
];

/* ========================= */
/* SEED                      */
/* ========================= */
const seedRoles = async () => {
  try {
    await connectDB();

    await Role.deleteMany();
    await Permission.deleteMany();

    await Permission.insertMany(PERMISSIONS);
    console.log("✅ Permisos creados");

    for (const role of ROLES) {
      await Role.create(role);
    }

    console.log("✅ Roles creados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};

seedRoles();
