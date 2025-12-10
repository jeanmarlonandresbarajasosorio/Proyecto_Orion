import express from "express";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());

// conectar mongo
connectDB();

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(3001, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3001");
});
