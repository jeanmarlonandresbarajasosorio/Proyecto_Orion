export const exportExcel = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    console.log("📥 Excel request:", desde, hasta);

    if (!desde || !hasta) {
      return res.status(400).json({ message: "Fechas requeridas" });
    }

    const data = await Mantenimiento.find({
      createdAt: {
        $gte: new Date(desde),
        $lte: new Date(hasta + "T23:59:59"),
      },
    }).sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Mantenimientos");

    sheet.columns = [
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Sede", key: "sede", width: 20 },
      { header: "Área", key: "area", width: 20 },
      { header: "Equipo", key: "equipo", width: 25 },
      { header: "Dispositivo", key: "dispositivo", width: 20 },
      { header: "Inventario", key: "inventario", width: 20 },
      { header: "Observaciones", key: "observaciones", width: 40 },
    ];

    data.forEach((m) => {
      if (m.equipos?.length) {
        m.equipos.forEach((eq) => {
          sheet.addRow({
            fecha: m.createdAt.toISOString().split("T")[0],
            sede: m.sede,
            area: m.area,
            equipo: eq.nombreEquipo,
            dispositivo: eq.dispositivo,
            inventario: eq.inventario,
            observaciones: m.observaciones || "",
          });
        });
      } else {
        sheet.addRow({
          fecha: m.createdAt.toISOString().split("T")[0],
          sede: m.sede,
          area: m.area,
          equipo: "",
          dispositivo: "",
          inventario: "",
          observaciones: m.observaciones || "",
        });
      }
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ORION_Mantenimientos.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error Excel:", error);
    res.status(500).json({ message: "Error generando Excel" });
  }
};
