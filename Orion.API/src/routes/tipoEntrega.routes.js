import { Router } from "express";
import {
  getAll,
  create,
  update,
} from "../controllers/tipoEntrega.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

export default router;
