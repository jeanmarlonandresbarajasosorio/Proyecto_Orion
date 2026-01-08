import { Router } from "express";
import { sendActaTarjetaEmail } from "../controllers/email.controller.js";

const router = Router();

router.post("/acta-tarjeta", sendActaTarjetaEmail);

export default router;
