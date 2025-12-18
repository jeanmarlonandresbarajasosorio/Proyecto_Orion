import express from "express";
import {
  getMemoriasRam,
  createMemoriaRam,
  updateMemoriaRam,
} from "../controllers/memoriaRam.controller.js";

const router = express.Router();

/* ===================== */
/* ROUTES                */
/* ===================== */
router.get("/", getMemoriasRam);
router.post("/", createMemoriaRam);
router.put("/:id", updateMemoriaRam);

export default router;
