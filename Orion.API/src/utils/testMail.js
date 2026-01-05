// testMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Orion API" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      subject: "Prueba de correo Orion",
      text: "✅ Si recibes esto, tu correo funciona correctamente."
    });

    console.log("Correo enviado correctamente:", info.messageId);
    process.exit(0);
  } catch (error) {
    console.error("Error al enviar correo:", error);
    process.exit(1);
  }
}

testEmail();
