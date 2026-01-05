import PDFDocument from "pdfkit";

export const generateActaPDF = (acta) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(16).text("ACTA DE ENTREGA – TARJETA CONTROL DE ACCESO", {
      align: "center"
    });

    doc.moveDown();

    doc.fontSize(11);
    doc.text(`Sede: ${acta.sede}`);
    doc.text(`Fecha: ${acta.dia}/${acta.mes}/${acta.anio}`);
    doc.moveDown();

    doc.text(`Nombre: ${acta.nombre}`);
    doc.text(`Cédula: ${acta.cedula}`);
    doc.text(`Correo: ${acta.correo}`);
    doc.moveDown();

    doc.text("El responsable declara haber recibido la tarjeta de control de acceso.");
    doc.moveDown(2);

    doc.text("Firma:", { underline: true });

    if (acta.firma) {
      const img = acta.firma.replace(/^data:image\/png;base64,/, "");
      doc.image(Buffer.from(img, "base64"), {
        width: 200
      });
    }

    doc.end();
  });
};
