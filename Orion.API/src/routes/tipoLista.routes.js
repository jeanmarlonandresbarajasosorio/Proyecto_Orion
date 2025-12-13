import { Router } from "express";
import {
  getTiposLista,
  getTipoListaById,
  createTipoLista,
  updateTipoLista,
} from "../controllers/tipoLista.controller.js";

const router = Router();

router.get("/", getTiposLista);
router.get("/:id", getTipoListaById);
router.post("/", createTipoLista);
router.put("/:id", updateTipoLista);

export default router;
