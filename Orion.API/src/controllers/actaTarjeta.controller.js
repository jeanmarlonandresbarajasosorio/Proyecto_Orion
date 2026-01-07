import ActaTarjeta from "../models/ActaTarjeta.js";
import { generateActaPDF } from "../utils/generateActaPDF.js";
import { sendEmailWithPDF } from "../utils/sendEmail.js";

// Crear o Actualizar Acta (POST/PUT unificado)
export const crearOActualizarActa = async (req, res) => {
  // Extraemos el id al inicio para que esté disponible en el catch si algo falla
  const { id } = req.params;

  try {
    // 1. LIMPIEZA Y PREPARACIÓN DE DATOS
    // Aseguramos que los campos obligatorios (dia, mes, anio) existan y sean strings
    const datosActa = {
      ...req.body,
      dia: req.body.dia?.toString() || "",
      mes: req.body.mes?.toString() || "",
      anio: req.body.anio?.toString() || "",
      // Limpiamos los IDs si vienen como objetos desde el frontend
      tipoEntrega: req.body.tipoEntrega?._id || req.body.tipoEntrega,
      tipoCambio: req.body.tipoCambio?._id || req.body.tipoCambio
    };

    let acta;

    if (id) {
      // MODO EDICIÓN: Actualiza el registro existente
      // { runValidators: true } asegura que Mongoose verifique los campos requeridos
      acta = await ActaTarjeta.findByIdAndUpdate(id, datosActa, { 
        new: true, 
        runValidators: true 
      });

      if (!acta) {
        return res.status(404).json({ message: "Acta no encontrada para editar" });
      }
    } else {
      // MODO CREACIÓN: Crea un nuevo registro
      acta = await ActaTarjeta.create(datosActa);
    }

    // 2. PROCESO DE PDF Y ENVÍO (Protegido para no romper el flujo)
    try {
      const pdfBuffer = await generateActaPDF(acta);
      await sendEmailWithPDF(acta.correo, pdfBuffer);
    } catch (mailError) {
      // Si el correo falla (Error 535), devolvemos 201 indicando que el registro SÍ se guardó
      console.warn("Error SMTP detectado (El acta se guardó, pero el mail no salió):", mailError.message);
      return res.status(201).json({
        message: "Acta guardada correctamente, pero hubo un error al enviar el correo.",
        acta,
        warning: "Revisa la contraseña de aplicación de Gmail en tu .env"
      });
    }

    // 3. RESPUESTA EXITOSA
    res.status(id ? 200 : 201).json({
      message: id ? "Acta actualizada y enviada con éxito" : "Acta creada y enviada con éxito",
      acta,
    });

  } catch (error) {
    console.error("Error crítico en el controlador de actas:", error);
    // Respondemos con el error de validación específico para saber qué campo falló
    res.status(500).json({ 
      message: id ? "Error al actualizar el acta" : "Error al crear el acta",
      error: error.message 
    });
  }
};

// Obtener todas las actas (GET)
export const getActasTarjeta = async (req, res) => {
  try {
    const actas = await ActaTarjeta.find().sort({ createdAt: -1 }); 
    res.status(200).json(actas);
  } catch (error) {
    console.error("Error al obtener actas:", error);
    res.status(500).json({ message: "Error al obtener actas" });
  }
};

// Eliminar acta
export const eliminarActaTarjeta = async (req, res) => {
  try {
    const { id } = req.params;
    await ActaTarjeta.findByIdAndDelete(id);
    res.status(200).json({ message: "Acta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar acta:", error);
    res.status(500).json({ message: "Error al eliminar el acta" });
  }
};