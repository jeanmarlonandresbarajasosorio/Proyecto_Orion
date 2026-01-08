// testMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
  console.log("Iniciando prueba de correo para:", process.env.SMTP_USER);
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        // Limpiamos la contraseña antes de probar
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : ""
      }
    });

    const info = await transporter.sendMail({
      from: `"Orion API Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      subject: "Prueba de correo Orion ✅",
      text: "Si recibes esto, la configuración de tu .env es correcta y el error 535 ha desaparecido."
    });

    console.log("✅ Correo enviado correctamente:", info.messageId);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
    process.exit(1);
  }
}

testEmail();