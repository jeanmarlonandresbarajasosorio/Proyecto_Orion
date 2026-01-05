import { Router } from "express";
import {
  getTiposCambio,
  createTipoCambio,
  updateTipoCambio,
} from "../controllers/tipoCambio.controller.js";

const router = Router();

router.get("/", getTiposCambio);
router.post("/", createTipoCambio);
router.put("/:id", updateTipoCambio);

export default router;
