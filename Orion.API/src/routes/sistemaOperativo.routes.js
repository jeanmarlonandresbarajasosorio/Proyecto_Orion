import express from "express";
import { getAll, create, update } from "../controllers/sistemaOperativo.controller.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

export default router;
