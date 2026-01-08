import nodemailer from "nodemailer";
import { generateActaTarjetaPDF } from "../utils/actaTarjetaPdf.js";

export const sendActaTarjetaEmail = async (req, res) => {
  try {
    /* ===========================
       DATOS RECIBIDOS
    =========================== */
    const acta = req.body;
    const { correo, nombre, actaId } = acta;

    if (!correo || !nombre) {
      return res.status(400).json({ message: "Datos incompletos para el correo" });
    }

    /* ===========================
       GENERAR PDF DEL ACTA
    =========================== */
    const pdfBuffer = await generateActaTarjetaPDF(acta);

    /* ===========================
       TRANSPORTER SMTP (Ajustado)
    =========================== */
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      // Usamos Number para asegurar que sea un entero
      port: Number(process.env.SMTP_PORT), 
      // Comparamos string para obtener el booleano correcto
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        // .trim() y .replace eliminan espacios accidentales de la contraseña
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : ""
      },
      // TLS permite que la conexión no sea rechazada por certificados locales
      tls: {
        rejectUnauthorized: false
      }
    });

    /* ===========================
       ENVIAR CORREO CON PDF
    =========================== */
    await transporter.sendMail({
      from: `"Orion" <${process.env.SMTP_USER}>`,
      to: correo,
      subject: "Acta de Entrega – Tarjeta de Acceso",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hola <b>${nombre}</b>,</p>
          <p>Tu acta de entrega de la tarjeta de acceso fue registrada correctamente.</p>
          ${actaId ? `<p><b>ID del Acta:</b> ${actaId}</p>` : ""}
          <p>Adjunto encontrarás el acta en formato PDF.</p>
          <br/>
          <p>Saludos,<br/><b>Equipo Orion</b></p>
        </div>
      `,
      attachments: [
        {
          filename: `Acta_Tarjeta_${actaId || "sin_id"}.pdf`,
          content: pdfBuffer
        }
      ]
    });

    res.json({ ok: true, message: "Correo enviado con éxito" });
  } catch (error) {
    // Log detallado para identificar si el error es de Gmail o de los datos
    console.error("❌ Error enviando correo con PDF:", error.message);
    res.status(500).json({ 
      message: "No se pudo enviar el correo",
      error: error.message 
    });
  }
};