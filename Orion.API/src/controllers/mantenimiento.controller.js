import ExcelJS from "exceljs";
import Mantenimiento from "../models/Mantenimiento.js";

export const getAllOrExcel = async (req, res) => {
  try {
    const { desde, hasta, export: exportType } = req.query;
    const query = {};

    // 1. FILTRO DE FECHAS
    if (desde && hasta) {
      query.fechaEntrega = {
        $gte: new Date(`${desde}T00:00:00.000Z`),
        $lte: new Date(`${hasta}T23:59:59.999Z`),
      };
    }

    const mantenimientos = await Mantenimiento.find(query).lean();

    // 2. LÓGICA DE EXPORTACIÓN A EXCEL
    if (String(exportType).toLowerCase() === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reporte Mantenimientos");

      // Definición de columnas exhaustiva (Todos los campos del diálogo)
      sheet.columns = [
        // Datos del Área
        { header: "Sede", key: "sede", width: 15 },
        { header: "Área", key: "area", width: 15 },
        { header: "Ubicación", key: "ubicacion", width: 15 },
        
        // Datos del Equipo (Iterados)
        { header: "Nombre Equipo", key: "nombreEquipo", width: 18 },
        { header: "Dispositivo", key: "dispositivo", width: 15 },
        { header: "Inventario", key: "inventario", width: 12 },
        { header: "Procesador", key: "procesador", width: 15 },
        { header: "Disco", key: "disco", width: 10 },
        { header: "RAM", key: "ram", width: 10 },
        { header: "SO", key: "so", width: 15 },

        // Autorización y Recibo
        { header: "Fecha Retiro", key: "fechaRetiro", width: 18 },
        { header: "Autoriza Retiro", key: "autorizaRetiro", width: 20 },
        { header: "Fecha Entrega", key: "fechaEntrega", width: 18 },
        { header: "Recibe", key: "recibe", width: 20 },

        // Personal Técnico
        { header: "Funcionario Realiza", key: "funcionarioRealiza", width: 20 },
        { header: "Fecha Realiza", key: "fechaRealiza", width: 18 },
        { header: "Funcionario Aprueba", key: "funcionarioAprueba", width: 20 },
        { header: "Fecha Aprueba", key: "fechaAprueba", width: 18 },

        // Software Checks (en minúsculas como en el diálogo)
        { header: "SW: Antivirus", key: "sw_antivirus", width: 12 },
        { header: "SW: Nombre PC", key: "sw_nombre", width: 12 },
        { header: "SW: Windows Update", key: "sw_updates", width: 12 },
        { header: "SW: Dominio", key: "sw_dominio", width: 12 },
        { header: "SW: OCS", key: "sw_ocs", width: 12 },
        { header: "SW: SAP", key: "sw_sap", width: 12 },

        // Garantía
        { header: "En Garantía", key: "garantia", width: 10 },
        { header: "Vence Garantía", key: "vencimientoGarantia", width: 15 },

        // Hardware Checks (en minúsculas como en el diálogo)
        { header: "HW: Limpieza CPU", key: "hw_cpu", width: 12 },
        { header: "HW: Monitor", key: "hw_monitor", width: 12 },
        { header: "HW: Periféricos", key: "hw_perifericos", width: 12 },
        { header: "HW: Crema Disipadora", key: "hw_crema", width: 12 },
        { header: "HW: Board", key: "hw_board", width: 12 },
        { header: "HW: Portátil", key: "hw_portatil", width: 12 },

        // Mantenimiento TIC
        { header: "Funcionario TIC", key: "funcionarioTicMantenimiento", width: 20 },
        { header: "Fecha Mant. TIC", key: "fechaTicMantenimiento", width: 18 },

        // Tiempos y Otros
        { header: "Minutos Parada", key: "minutosParada", width: 12 },
        { header: "Proporción %", key: "proporcionParada", width: 12 },
        { header: "Disponibilidad Total", key: "totalDisponibilidad", width: 12 },
        { header: "Orden SAP", key: "noOrdenSAP", width: 15 },
        { header: "Observaciones", key: "observaciones", width: 30 }
      ];

      sheet.getRow(1).font = { bold: true };

      // 3. LLENADO DE DATOS
      mantenimientos.forEach((m) => {
        const listaEquipos = Array.isArray(m.equipos) && m.equipos.length > 0 
          ? m.equipos 
          : [{}];

        listaEquipos.forEach((eq) => {
          sheet.addRow({
            sede: m.sede || "",
            area: m.area || "",
            ubicacion: m.ubicacion || "",
            nombreEquipo: eq.nombreEquipo || "",
            dispositivo: eq.dispositivo || "",
            inventario: eq.inventario || "",
            procesador: eq.procesador || "",
            disco: eq.disco || "",
            ram: eq.ram || "",
            so: eq.so || "",

            fechaRetiro: m.fechaRetiro ? new Date(m.fechaRetiro).toLocaleString() : "",
            autorizaRetiro: m.autorizaRetiro || "",
            fechaEntrega: m.fechaEntrega ? new Date(m.fechaEntrega).toLocaleString() : "",
            recibe: m.recibe || "",

            funcionarioRealiza: m.funcionarioRealiza || "",
            fechaRealiza: m.fechaRealiza ? new Date(m.fechaRealiza).toLocaleString() : "",
            funcionarioAprueba: m.funcionarioAprueba || "",
            fechaAprueba: m.fechaAprueba ? new Date(m.fechaAprueba).toLocaleString() : "",

            // Mapeo Software (Usando minúsculas como quedó el diálogo)
            sw_antivirus: m.softwareChecks?.antivirus || "",
            sw_nombre: m.softwareChecks?.["nombre del computador"] || "",
            sw_updates: m.softwareChecks?.["actualizaciones de windows"] || "",
            sw_dominio: m.softwareChecks?.["dominio foscal.loc"] || "",
            sw_ocs: m.softwareChecks?.["ocs inventory"] || "",
            sw_sap: m.softwareChecks?.sap || "",

            garantia: m.garantia || "",
            vencimientoGarantia: m.vencimientoGarantia || "",

            // Mapeo Hardware (Usando minúsculas como quedó el diálogo)
            hw_cpu: m.hardwareChecks?.["limpieza cpu/aio"] || "",
            hw_monitor: m.hardwareChecks?.["limpieza monitor"] || "",
            hw_perifericos: m.hardwareChecks?.["limpieza periféricos"] || "",
            hw_crema: m.hardwareChecks?.["cambio crema disipadora"] || "",
            hw_board: m.hardwareChecks?.["limpieza board y componentes"] || "",
            hw_portatil: m.hardwareChecks?.["limpieza portátil"] || "",

            funcionarioTicMantenimiento: m.funcionarioTicMantenimiento || "",
            fechaTicMantenimiento: m.fechaTicMantenimiento ? new Date(m.fechaTicMantenimiento).toLocaleString() : "",

            minutosParada: m.minutosParada || "",
            proporcionParada: m.proporcionParada || "",
            totalDisponibilidad: m.totalDisponibilidad || "",
            noOrdenSAP: m.noOrdenSAP || "",
            observaciones: m.observaciones || ""
          });
        });
      });

      // 4. ENVÍO DEL ARCHIVO
      res.setHeader(
        "Content-Type", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition", 
        'attachment; filename="Reporte_Mantenimientos.xlsx"'
      );

      const buffer = await workbook.xlsx.writeBuffer();
      return res.status(200).send(buffer);
    }

    // 5. RESPUESTA JSON NORMAL
    return res.status(200).json(mantenimientos);

  } catch (error) {
    console.error("❌ Error Grave en el Servidor:", error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: "No se pudo generar el reporte", 
        error: error.message 
      });
    }
  }
};