import express from "express";
import {
  getAreas,
  createArea,
  updateArea,
} from "../controllers/area.controller.js";

const router = express.Router();

router.get("/", getAreas);
router.post("/", createArea);
router.put("/:id", updateArea);

export default router;
