import { Router } from "express";
import { 
  crearOActualizarActa, 
  getActasTarjeta 
} from "../controllers/actaTarjeta.controller.js";

const router = Router();

router.post("/", crearOActualizarActa);

router.get("/", getActasTarjeta);


router.put("/:id", crearOActualizarActa);

export default router;