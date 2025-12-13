import express from "express";
import {
  getFuncionarios,
  createFuncionario,
  updateFuncionario,
} from "../controllers/funcionario.controller.js";

const router = express.Router();

router.get("/", getFuncionarios);
router.post("/", createFuncionario);
router.put("/:id", updateFuncionario);

export default router;
