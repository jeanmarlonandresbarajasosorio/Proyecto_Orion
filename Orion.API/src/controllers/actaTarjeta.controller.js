import ActaTarjeta from "../models/ActaTarjeta.js";
import { generateActaPDF } from "../utils/generateActaPDF.js";
import { sendEmailWithPDF } from "../utils/sendEmail.js";

// Crear acta (POST)
export const crearActaTarjeta = async (req, res) => {
  try {
    const acta = await ActaTarjeta.create(req.body);

    const pdfBuffer = await generateActaPDF(acta);
    await sendEmailWithPDF(acta.correo, pdfBuffer);

    res.status(201).json({
      message: "Acta creada y enviada por correo",
      acta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear acta" });
  }
};

// Obtener todas las actas (GET)
export const getActasTarjeta = async (req, res) => {
  try {
    const actas = await ActaTarjeta.find().sort({ createdAt: -1 }); // orden descendente
    res.status(200).json(actas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener actas" });
  }
};
