import express from "express";

const router = express.Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("API funcionando");
});

export default router;
