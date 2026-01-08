import ActaTarjeta from "../models/ActaTarjeta.js";
import { generateActaTarjetaPDF } from "../utils/actaTarjetaPdf.js";
import { sendEmailWithPDF } from "../utils/sendEmail.js";

// Crear o Actualizar Acta (POST/PUT unificado)
export const crearOActualizarActa = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. LIMPIEZA Y PREPARACIÓN DE DATOS
    // Agregamos numeroTarjeta y entregadoPor a la limpieza
    const datosActa = {
      ...req.body,
      dia: req.body.dia?.toString() || "",
      mes: req.body.mes?.toString() || "",
      anio: req.body.anio?.toString() || "",
      tipoEntrega: req.body.tipoEntrega?._id || req.body.tipoEntrega,
      tipoCambio: req.body.tipoCambio?._id || req.body.tipoCambio,
      entregadoPor: req.body.entregadoPor?._id || req.body.entregadoPor,
      numeroTarjeta: req.body.numeroTarjeta || ""
    };

    let acta;

    if (id) {
      // MODO EDICIÓN
      acta = await ActaTarjeta.findByIdAndUpdate(id, datosActa, { 
        new: true, 
        runValidators: true 
      });

      if (!acta) {
        return res.status(404).json({ message: "Acta no encontrada para editar" });
      }
    } else {
      // MODO CREACIÓN
      acta = await ActaTarjeta.create(datosActa);
    }
    try {
      const datosParaPdf = {
        ...acta.toObject(), 
        tipoEntregaNombre: req.body.tipoEntregaNombre, 
        tipoCambioNombre: req.body.tipoCambioNombre,  
        entregadoPorNombre: req.body.entregadoPorNombre 
      };

      const pdfBuffer = await generateActaTarjetaPDF(datosParaPdf);
      await sendEmailWithPDF(acta.correo, pdfBuffer);
      
      console.log(`✅ PDF generado y enviado a: ${acta.correo}`);
    } catch (mailError) {
      console.warn("⚠ Error SMTP (El acta se guardó, pero el mail falló):", mailError.message);
      return res.status(201).json({
        message: "Acta guardada correctamente, pero hubo un error al enviar el correo.",
        acta,
        warning: "Verifica la configuración SMTP en el servidor."
      });
    }

    // 3. RESPUESTA EXITOSA
    res.status(id ? 200 : 201).json({
      message: id ? "Acta actualizada y enviada con éxito" : "Acta creada y enviada con éxito",
      acta,
    });

  } catch (error) {
    console.error("❌ Error crítico en el controlador de actas:", error);
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