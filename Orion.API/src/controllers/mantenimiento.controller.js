import ExcelJS from "exceljs";
import Mantenimiento from "../models/Mantenimiento.js";

export const getAllOrExcel = async (req, res) => {
  try {
    const { desde, hasta, export: exportType } = req.query;
    const query = {};

    // 1️⃣ Filtro de fechas
    if (desde && hasta) {
      query.createdAt = {
        $gte: new Date(desde + "T00:00:00.000Z"),
        $lte: new Date(hasta + "T23:59:59.999Z"),
      };
    }

    const mantenimientos = await Mantenimiento
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    // ================= EXPORTAR A EXCEL =================
    if (exportType === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Mantenimientos");

      // 2️⃣ DEFINICIÓN DE COLUMNAS (APLANADAS)
      sheet.columns = [
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Sede", key: "sede", width: 25 },
        { header: "Área", key: "area", width: 20 },
        { header: "Ubicación", key: "ubicacion", width: 20 },

        { header: "Equipo", key: "equipo", width: 20 },
        { header: "Dispositivo", key: "dispositivo", width: 15 },
        { header: "Inventario", key: "inventario", width: 15 },
        { header: "SO", key: "so", width: 15 },

        { header: "Dominio Foscal", key: "dominio", width: 20 },
        { header: "Antivirus", key: "antivirus", width: 15 },
        { header: "Nombre Computador", key: "nombrePc", width: 20 },
        { header: "Actualizaciones Windows", key: "windows", width: 25 },
        { header: "OCS Inventory", key: "ocs", width: 20 },
        { header: "SAP", key: "sapSoftware", width: 15 },

        { header: "Limpieza CPU", key: "cpu", width: 20 },
        { header: "Limpieza Monitor", key: "monitor", width: 20 },
        { header: "Limpieza Periféricos", key: "perifericos", width: 25 },
        { header: "Cambio Crema", key: "crema", width: 20 },
        { header: "Limpieza Board", key: "board", width: 25 },
        { header: "Limpieza Portátil", key: "portatil", width: 25 },

        { header: "Funcionario", key: "funcionario", width: 25 },
        { header: "Orden SAP", key: "sapOrden", width: 15 },
        { header: "Garantía", key: "garantia", width: 10 },
        { header: "Observaciones", key: "obs", width: 30 },
      ];

      // 3️⃣ LLENADO DE FILAS (APLANANDO JSON)
      mantenimientos.forEach((m) => {
        const fecha = m.createdAt
          ? new Date(m.createdAt).toISOString().split("T")[0]
          : "";

        const equipos = Array.isArray(m.equipos) && m.equipos.length
          ? m.equipos
          : [{}];

        equipos.forEach((eq) => {
          sheet.addRow({
            fecha,
            sede: m.sede || "",
            area: m.area || "",
            ubicacion: m.ubicacion || "",

            equipo: eq.nombreEquipo || "",
            dispositivo: eq.dispositivo || "",
            inventario: eq.inventario || "",
            so: eq.so || "",

            dominio: m.softwareChecks?.["Dominio Foscal"]?.loc ?? "",
            antivirus: m.softwareChecks?.Antivirus ?? "",
            nombrePc: m.softwareChecks?.["Nombre del computador"] ?? "",
            windows: m.softwareChecks?.["Actualizaciones de Windows"] ?? "",
            ocs: m.softwareChecks?.["OCS Inventory"] ?? "",
            sapSoftware: m.softwareChecks?.SAP ?? "",

            cpu: m.hardwareChecks?.["Limpieza CPU/AIO"] ?? "",
            monitor: m.hardwareChecks?.["Limpieza Monitor"] ?? "",
            perifericos: m.hardwareChecks?.["Limpieza Periféricos"] ?? "",
            crema: m.hardwareChecks?.["Cambio Crema Disipadora"] ?? "",
            board: m.hardwareChecks?.["Limpieza board y componentes"] ?? "",
            portatil: m.hardwareChecks?.["Limpieza Portátil"] ?? "",

            funcionario: m.funcionarioRealiza || "",
            sapOrden: m.noOrdenSAP || "",
            garantia: m.garantia || "",
            obs: m.observaciones || "",
          });
        });
      });

      // 4️⃣ RESPUESTA CORRECTA (EXCEL REAL)
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Reporte_Mantenimientos.xlsx"
      );

      const buffer = await workbook.xlsx.writeBuffer();
      return res.status(200).send(buffer);
    }

    // ================= JSON NORMAL =================
    return res.json(mantenimientos);

  } catch (error) {
    console.error("❌ ERROR CRÍTICO:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Error interno del servidor",
        detalle: error.message
      });
    }
  }
};