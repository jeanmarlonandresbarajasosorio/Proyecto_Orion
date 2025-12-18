import express from "express";
import {
  getProcesadores,
  createProcesador,
  updateProcesador,
} from "../controllers/procesador.controller.js";

const router = express.Router();

router.get("/", getProcesadores);
router.post("/", createProcesador);
router.put("/:id", updateProcesador);

export default router;
