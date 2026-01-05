import { Router } from "express";
import { crearActaTarjeta, getActasTarjeta } from "../controllers/actaTarjeta.controller.js";

const router = Router();

// Rutas
router.post("/", crearActaTarjeta);
router.get("/", getActasTarjeta); 
export default router;
