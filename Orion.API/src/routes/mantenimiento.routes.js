import express from "express";
// Importamos las funciones del controlador avanzado
import { 
  getAllOrExcel, 
  createMantenimiento, 
  updateMantenimiento, 
  deleteMantenimiento 
} from "../controllers/mantenimientoController.js"; 

const router = express.Router();

// 🔹 Obtener todos O Exportar a Excel (Depende de si viene ?export=excel)
// Esta ruta reemplaza tu GET básico porque getAllOrExcel ya hace el .find()
router.get("/", getAllOrExcel);

// 🔹 Obtener por ID (Opcional, pero útil)
router.get("/:id", async (req, res) => {
  try {
    const item = await Mantenimiento.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "No encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 POST crear (Usando la función del controlador)
router.post("/", createMantenimiento);

// 🔹 PUT actualizar (Usando la función del controlador corregida)
// Esta es la que arregla el error de edición
router.put("/:id", updateMantenimiento);

// 🔹 DELETE (Usando la función del controlador)
router.delete("/:id", deleteMantenimiento);

export default router;