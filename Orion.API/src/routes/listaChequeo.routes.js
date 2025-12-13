import express from "express";
import {
  getListasChequeo,
  createListaChequeo,
  updateListaChequeo,
} from "../controllers/listaChequeo.controller.js";

const router = express.Router();

router.get("/", getListasChequeo);
router.post("/", createListaChequeo);
router.put("/:id", updateListaChequeo);

export default router;
