import express from "express";

const router = express.Router();

router.get("/mongo", async (req, res) => {
  try {
    const result = await req.app
      .get("mongoose")
      .connection.db
      .collection("test")
      .insertOne({
        mensaje: "Mongo conectado desde API",
        fecha: new Date(),
      });

    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
