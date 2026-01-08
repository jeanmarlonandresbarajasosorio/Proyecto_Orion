import PDFDocument from "pdfkit";
import path from "path";

export const generateActaTarjetaPDF = (acta) => {
  return new Promise((resolve) => {
    // Configuración de página A4
    const doc = new PDFDocument({ 
      margin: 50, 
      size: "A4",
      info: { Title: `Acta Tarjeta - ${acta.nombre}` } 
    });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Determinar nombre de la institución
    const nombreInstitucion =
      acta.sede === "foscal"
        ? "FOSCAL"
        : acta.sede === "foscal-internacional"
        ? "FUNDACIÓN FOSUNAB"
        : "LA INSTITUCIÓN";

    /* ============================================================
       ENCABEZADO CON LOGO Y ESTILO
       ============================================================ */
    doc.rect(0, 0, 612, 85).fill("#f8f9fa"); // Fondo gris claro superior

    // Inserción del Logo FOSCAL
    try {
      const logoPath = path.resolve("logo-foscal-transparente.png");
      doc.image(logoPath, 45, 15, { width: 100 });
    } catch (err) {
      console.warn("⚠️ No se pudo cargar el logo:", err.message);
    }

    // Títulos alineados
    doc.fillColor("#333").fontSize(16).font("Helvetica-Bold")
       .text("ACTA DE ENTREGA", 160, 28, { align: "left" });
    doc.fontSize(11).font("Helvetica")
       .text("TARJETA DE CONTROL DE ACCESO", 160, 48, { align: "left" });

    doc.moveDown(4);

    /* ============================================================
       SECCIÓN: INFORMACIÓN DEL REGISTRO
       ============================================================ */
    doc.fillColor("#000").fontSize(11).font("Helvetica-Bold").text("INFORMACIÓN DEL REGISTRO", 50);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).strokeColor("#333").lineWidth(1).stroke();
    doc.moveDown(1);

    doc.fontSize(10).font("Helvetica");
    const yInfo = doc.y;
    doc.text(`Sede:`, 60, yInfo, { continued: true }).font("Helvetica-Bold").text(` ${acta.sede || 'N/A'}`);
    doc.font("Helvetica").text(`Fecha:`, 350, yInfo, { continued: true }).font("Helvetica-Bold").text(` ${acta.dia}/${acta.mes}/${acta.anio}`);
    
    doc.moveDown(0.8);
    const yTipo = doc.y;
    doc.font("Helvetica").text(`Tipo de Entrega:`, 60, yTipo, { continued: true }).font("Helvetica-Bold").text(` ${acta.tipoEntregaNombre || 'N/A'}`);
    doc.font("Helvetica").text(`Tipo de Cambio:`, 350, yTipo, { continued: true }).font("Helvetica-Bold").text(` ${acta.tipoCambioNombre || 'N/A'}`);

    /* ============================================================
       SECCIÓN: DATOS DEL RESPONSABLE
       ============================================================ */
    doc.moveDown(2);
    doc.fontSize(11).font("Helvetica-Bold").text("DATOS DEL RESPONSABLE");
    doc.moveDown(0.8);

    doc.fontSize(10).font("Helvetica");
    doc.text(`Nombre Completo:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.nombre}`);
    doc.moveDown(0.4);
    doc.font("Helvetica").text(`Cédula de Ciudadanía:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.cedula}`);
    doc.moveDown(0.4);
    doc.font("Helvetica").text(`Correo Electrónico:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.correo}`);

    /* ============================================================
       SECCIÓN: NORMAS DE USO Y FIRMA (CUADRO INTEGRADO)
       ============================================================ */
    doc.moveDown(2);
    const boxStartX = 50;
    const boxStartY = doc.y;
    const boxWidth = 500;
    const boxHeight = 120;

    // Dibujar el recuadro grande que contiene el texto y la firma
    doc.rect(boxStartX, boxStartY, boxWidth, boxHeight).strokeColor("#000").lineWidth(1).stroke();

    // Texto de aceptación (dentro del cuadro)
    doc.fontSize(9).font("Helvetica").fillColor("#000")
       .text(`El firmante declara haber recibido la tarjeta de control de acceso y se compromete a su custodia y uso personal e intransferible. En caso de pérdida o daño, deberá reportarlo inmediatamente a la oficina de sistemas de ${nombreInstitucion}.`, 
       boxStartX + 10, boxStartY + 10, { width: boxWidth - 20, align: "justify" });

    // Estampado de la firma (dentro del cuadro, parte inferior izquierda)
    if (acta.firma) {
      try {
        const firmaBase64 = acta.firma.replace(/^data:image\/png;base64,/, "");
        const firmaBuffer = Buffer.from(firmaBase64, "base64");
        // Posicionada sobre la línea de firma pero dentro del cuadro
        doc.image(firmaBuffer, boxStartX + 20, boxStartY + 65, { fit: [150, 50] });
      } catch (e) {
        doc.fontSize(8).text("[Firma no cargada]", boxStartX + 20, boxStartY + 80);
      }
    }

    /* ============================================================
       PIE DE FIRMA (Debajo del cuadro)
       ============================================================ */
    doc.moveDown(6.5);
    const lineY = doc.y;
    doc.moveTo(50, lineY).lineTo(250, lineY).strokeColor("#000").stroke();
    
    doc.fontSize(10).font("Helvetica-Bold").text("Firma del Responsable", 50, lineY + 5);
    doc.fontSize(9).font("Helvetica").text(`C.C. ${acta.cedula}`, 50, lineY + 18);

    /* ============================================================
       PIE DE PÁGINA
       ============================================================ */
    doc.fontSize(8).fillColor("#999")
       .text("Este documento es una representación digital del acta de entrega generada por el Sistema Orion.", 50, 760, { align: "center" });

    doc.end();
  });
};