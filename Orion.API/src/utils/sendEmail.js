import nodemailer from "nodemailer";

export const sendEmailWithPDF = async (to, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Orion Sistemas" <${process.env.SMTP_USER}>`,
    to,
    subject: "Acta de Entrega – Tarjeta de Acceso",
    html: `
      <p>Adjunto encontrará el acta de entrega de la tarjeta de control de acceso.</p>
      <p>Este correo fue generado automáticamente.</p>
    `,
    attachments: [
      {
        filename: "acta-tarjeta.pdf",
        content: pdfBuffer
      }
    ]
  });
};
