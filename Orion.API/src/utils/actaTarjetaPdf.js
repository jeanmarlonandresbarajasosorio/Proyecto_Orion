import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const generateActaTarjetaPDF = (acta) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      margin: 50, 
      size: "A4",
      info: { Title: `Acta Tarjeta - ${acta.nombre}` } 
    });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Determinar nombre de la institución según sede
    const nombreInstitucion =
      acta.sede === "foscal"
        ? "FOSCAL"
        : acta.sede === "foscal-internacional"
        ? "FUNDACIÓN FOSUNAB"
        : "LA INSTITUCIÓN";

    /* ============================================================
       ENCABEZADO: LOGO GRANDE Y TEXTO CERCANO
       ============================================================ */
    const logoPath = path.join(process.cwd(), "public", "logo-foscal-transparente.png");
    const headerTop = 40; 

    if (fs.existsSync(logoPath)) {
      // Logo con altura de 60 para que destaque
      doc.image(logoPath, 50, headerTop, { height: 60 });
    }

    // Se cambió X de 160 a 125 para acercar el texto al logo
    doc.fillColor("#000").fontSize(14).font("Helvetica-Bold")
       .text("ACTA DE ENTREGA", 125, headerTop + 12, { align: "left" });
    
    doc.fontSize(10).font("Helvetica")
       .text("TARJETA DE CONTROL DE ACCESO", 125, headerTop + 30, { align: "left" });

    // Posición del cursor para el contenido siguiente
    doc.y = headerTop + 75;

    /* ============================================================
       SECCIÓN 1: DATOS DEL REGISTRO
       ============================================================ */
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#dee2e6").lineWidth(0.5).stroke();
    doc.moveDown(0.8);

    doc.fontSize(9).font("Helvetica").fillColor("#000");
    const yReg = doc.y;
    
    doc.text(`Sede:`, 60, yReg, { continued: true }).font("Helvetica-Bold").text(` ${acta.sede?.toUpperCase()}`);
    doc.font("Helvetica").text(`Fecha:`, 350, yReg, { continued: true }).font("Helvetica-Bold").text(` ${acta.dia} / ${acta.mes} / ${acta.anio}`);
    
    doc.moveDown(0.6);
    const yTipos = doc.y;
    
    const tEntrega = acta.tipoEntregaNombre || acta.tipoEntrega?.nombre || 'N/A';
    const tCambio = acta.tipoCambioNombre || acta.tipoCambio?.nombre || 'N/A';
    
    doc.font("Helvetica").text(`Tipo Entrega:`, 60, yTipos, { continued: true }).font("Helvetica-Bold").text(` ${tEntrega}`);
    doc.font("Helvetica").text(`Tipo Cambio:`, 350, yTipos, { continued: true }).font("Helvetica-Bold").text(` ${tCambio}`);

    doc.moveDown(0.6);
    const yNuevos = doc.y;
    
    const ePor = acta.entregadoPorNombre || acta.entregadoPor?.nombre || 'N/A';
    
    doc.font("Helvetica").text(`N° Tarjeta:`, 60, yNuevos, { continued: true }).font("Helvetica-Bold").text(` ${acta.numeroTarjeta || 'N/A'}`);
    doc.font("Helvetica").text(`Entregado por:`, 350, yNuevos, { continued: true }).font("Helvetica-Bold").text(` ${ePor}`);

    /* ============================================================
       SECCIÓN 2: NORMAS DE USO Y ACEPTACIÓN
       ============================================================ */
    doc.moveDown(1.5);
    doc.fontSize(10).font("Helvetica-Bold").text("NORMAS DE USO Y ACEPTACIÓN");
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).strokeColor("#dee2e6").stroke();
    doc.moveDown(0.8);

    doc.fontSize(8.5).font("Helvetica").fillColor("#000");
    
    const textoIntroductorio = "Al firmar este documento se da constancia de que se recibió una tarjeta de control de acceso y se aceptan las siguientes normas de uso:";
    doc.text(textoIntroductorio, 50, doc.y, { align: "justify" });
    doc.moveDown(0.4);

    const normas = [
      `La asignación de la tarjeta de control de acceso implica la obligación de custodiarla de modo que ninguna otra persona pueda hacer uso de la misma y por lo tanto el titular asume ante su empleador y/o ante terceros la responsabilidad por cualquier uso indebido que se haga a causa del descuido del manejo de la tarjeta de control de acceso.`,
      `La tarjeta de control de acceso permite el ingreso a algunas áreas restringidas de ${nombreInstitucion} de acuerdo a las funciones del cargo de la persona que recibe la misma, por lo tanto esta tarjeta es de uso personal e intransferible.`,
      `En caso de pérdida o hurto de la tarjeta de control de acceso, el responsable de la misma deberá notificar de forma inmediata a la institución y se compromete a formular el respectivo denuncio para que ${nombreInstitucion} tome medidas convenientes en forma oportuna. El responsable de la tarjeta asumirá todos los perjuicios que causen con la utilización no autorizada de la misma en caso de no realizar el reporte oportuno la Jefe interventoría de Outsourcing - Vigilancia 6191 - 6192.`,
      `En caso de hurto, pérdida o daño de la tarjeta de control de acceso se deberá cancelar el valor correspondiente establecido en el momento.`,
      `La tarjeta de control de acceso es de propiedad de la institución por lo que ${nombreInstitucion} se reserva el derecho de solicitar la devolución. Es deber del usuario su cuidado y mantenerla en buen estado.`,
      `La tarjeta de control de acceso debe ser entregada por el trabajador en la Subgerencia Tecnología al finalizar su contrato laboral con la institución o con terceros.`
    ];

    normas.forEach(norma => {
      doc.text(`• ${norma}`, 60, doc.y, { width: 480, align: "justify" });
      doc.moveDown(0.4);
    });

    /* ============================================================
       SECCIÓN 3: DATOS DEL RESPONSABLE
       ============================================================ */
    doc.moveDown(1);
    doc.fontSize(10).font("Helvetica-Bold").text("DATOS DEL RESPONSABLE (QUIEN RECIBE)");
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).strokeColor("#dee2e6").stroke();
    doc.moveDown(0.8);

    doc.fontSize(9).font("Helvetica");
    doc.text(`Nombre Completo:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.nombre}`);
    doc.moveDown(0.3);
    doc.font("Helvetica").text(`Documento de Identidad:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.cedula}`);
    doc.moveDown(0.3);
    doc.font("Helvetica").text(`Correo Electrónico:`, 60, doc.y, { continued: true }).font("Helvetica-Bold").text(` ${acta.correo}`);

    /* ============================================================
       SECCIÓN 4: RECUADRO DE FIRMA DIGITAL
       ============================================================ */
    doc.moveDown(1.5);
    const boxStartX = 50;
    const boxStartY = doc.y;
    const boxWidth = 500;
    const boxHeight = 100;

    doc.rect(boxStartX, boxStartY, boxWidth, boxHeight).strokeColor("#000").lineWidth(0.5).stroke();

    doc.fontSize(8).font("Helvetica").fillColor("#333")
       .text(`Declaro conocer y aceptar las normas de uso de la tarjeta de control de acceso aquí descritas.`, 
       boxStartX + 15, boxStartY + 8, { width: boxWidth - 30, align: "center" });

    if (acta.firma) {
      try {
        const firmaBuffer = Buffer.from(acta.firma.replace(/^data:image\/png;base64,/, ""), "base64");
        doc.image(firmaBuffer, boxStartX + 185, boxStartY + 30, { fit: [130, 50], align: 'center' });
      } catch (e) {
        doc.fontSize(7).text("[Firma Digital]", boxStartX + 10, boxStartY + 50, { align: 'center' });
      }
    }

    /* ============================================================
       PIE DE FIRMA FINAL
       ============================================================ */
    doc.moveDown(6.5);
    const lineY = doc.y;
    doc.moveTo(206, lineY).lineTo(406, lineY).strokeColor("#000").stroke(); 
    
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#000").text("FIRMA DEL RESPONSABLE", 50, lineY + 5, { align: "center" });
    doc.fontSize(8).font("Helvetica").text(`C.C. ${acta.cedula}`, 50, lineY + 16, { align: "center" });

    doc.fontSize(7).fillColor("#999")
       .text(`Generado por Sistema Orion - FOSCAL ${nombreInstitucion} | ${new Date().toLocaleString()}`, 50, 785, { align: "center" });

    doc.end();
  });
};