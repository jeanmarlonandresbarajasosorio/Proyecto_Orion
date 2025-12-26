import { Router } from "express";
import * as controller from "../controllers/mantenimientos.controller.js";

const router = Router();

// 1. Rutas Estáticas o de parámetros de consulta (Query) PRIMERO
router.get("/", controller.getAllOrExcel); 
// Si decides usar la ruta /excel por separado:
router.get("/excel", controller.exportExcel); 

// 2. Rutas con parámetros de ID DESPUÉS
router.get("/by-id/:id", controller.getById);
router.post("/", controller.create);
router.put("/by-id/:id", controller.update);
router.delete("/by-id/:id", controller.remove);

export default router;