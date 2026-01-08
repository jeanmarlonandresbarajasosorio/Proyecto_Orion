import nodemailer from "nodemailer";

export const sendEmailWithPDF = async (to, pdfBuffer) => {
  const cleanUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : "";
  const cleanPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : "";

  // LOG DE SEGURIDAD: Verifica esto en tu terminal de Docker
  console.log(`DEBUG SMTP: Usuario: ${cleanUser} | Pass Length: ${cleanPass.length}`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: cleanUser,
      pass: cleanPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"Orion Sistemas" <${cleanUser}>`,
      to,
      subject: "Acta de Entrega – Tarjeta de Acceso",
      html: `<p>Adjunto encontrará su acta en PDF.</p>`,
      attachments: [{ filename: "acta-tarjeta.pdf", content: pdfBuffer }]
    });
    console.log("✅ Envío exitoso");
  } catch (error) {
    console.error("❌ Error detallado:", error.message);
    throw error;
  }
};