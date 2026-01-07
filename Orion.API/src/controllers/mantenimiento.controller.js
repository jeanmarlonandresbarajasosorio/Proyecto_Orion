import ExcelJS from "exceljs";
import Mantenimiento from "../models/Mantenimiento.js";

// --- FUNCIONES DE APOYO ---
// Esta función quita los puntos de las llaves para que MongoDB no falle
const sanitizeData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    // Reemplaza puntos por espacios para evitar el error de "setDottedPath"
    const safeKey = key.replace(/\./g, " ");
    sanitized[safeKey] = obj[key];
  });
  return sanitized;
};

/* ==========================================================================
   1. OBTENER TODO / EXPORTAR EXCEL
   ========================================================================== */
export const getAllOrExcel = async (req, res) => {
  try {
    const { desde, hasta, export: exportType } = req.query;
    const query = {};

    if (desde && hasta) {
      query.fechaEntrega = {
        $gte: new Date(`${desde}T00:00:00.000Z`),
        $lte: new Date(`${hasta}T23:59:59.999Z`),
      };
    }

    const mantenimientos = await Mantenimiento.find(query).lean();

    if (String(exportType).toLowerCase() === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reporte Mantenimientos");

      sheet.columns = [
        { header: "Sede", key: "sede", width: 15 },
        { header: "Área", key: "area", width: 15 },
        { header: "Ubicación", key: "ubicacion", width: 15 },
        { header: "Nombre Equipo", key: "nombreEquipo", width: 18 },
        { header: "Dispositivo", key: "dispositivo", width: 15 },
        { header: "Inventario", key: "inventario", width: 12 },
        { header: "Procesador", key: "procesador", width: 15 },
        { header: "Disco", key: "disco", width: 10 },
        { header: "RAM", key: "ram", width: 10 },
        { header: "SO", key: "so", width: 15 },
        { header: "Fecha Retiro", key: "fechaRetiro", width: 18 },
        { header: "Autoriza Retiro", key: "autorizaRetiro", width: 20 },
        { header: "Fecha Entrega", key: "fechaEntrega", width: 18 },
        { header: "Recibe", key: "recibe", width: 20 },
        { header: "Funcionario Realiza", key: "funcionarioRealiza", width: 20 },
        { header: "Fecha Realiza", key: "fechaRealiza", width: 18 },
        { header: "Funcionario Aprueba", key: "funcionarioAprueba", width: 20 },
        { header: "Fecha Aprueba", key: "fechaAprueba", width: 18 },
        { header: "SW: Antivirus", key: "sw_antivirus", width: 12 },
        { header: "SW: Nombre PC", key: "sw_nombre", width: 12 },
        { header: "SW: Windows Update", key: "sw_updates", width: 12 },
        { header: "SW: Dominio", key: "sw_dominio", width: 12 },
        { header: "SW: OCS", key: "sw_ocs", width: 12 },
        { header: "SW: SAP", key: "sw_sap", width: 12 },
        { header: "En Garantía", key: "garantia", width: 10 },
        { header: "Vence Garantía", key: "vencimientoGarantia", width: 15 },
        { header: "HW: Limpieza CPU", key: "hw_cpu", width: 12 },
        { header: "HW: Monitor", key: "hw_monitor", width: 12 },
        { header: "HW: Periféricos", key: "hw_perifericos", width: 12 },
        { header: "HW: Crema Disipadora", key: "hw_crema", width: 12 },
        { header: "HW: Board", key: "hw_board", width: 12 },
        { header: "HW: Portátil", key: "hw_portatil", width: 12 },
        { header: "Funcionario TIC", key: "funcionarioTicMantenimiento", width: 20 },
        { header: "Fecha Mant. TIC", key: "fechaTicMantenimiento", width: 18 },
        { header: "Minutos Parada", key: "minutosParada", width: 12 },
        { header: "Proporción %", key: "proporcionParada", width: 12 },
        { header: "Disponibilidad Total", key: "totalDisponibilidad", width: 12 },
        { header: "Orden SAP", key: "noOrdenSAP", width: 15 },
        { header: "Observaciones", key: "observaciones", width: 30 }
      ];

      sheet.getRow(1).font = { bold: true };

      mantenimientos.forEach((m) => {
        const listaEquipos = Array.isArray(m.equipos) && m.equipos.length > 0 ? m.equipos : [{}];
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
            
            // Detecta tanto la versión con punto como la versión sin punto (sanitizada)
            sw_antivirus: m.softwareChecks?.Antivirus || m.softwareChecks?.antivirus || "",
            sw_nombre: m.softwareChecks?.["Nombre del computador"] || m.softwareChecks?.["nombre del computador"] || "",
            sw_updates: m.softwareChecks?.["Actualizaciones de Windows"] || m.softwareChecks?.["actualizaciones de windows"] || "",
            sw_dominio: m.softwareChecks?.["Dominio Foscal loc"] || m.softwareChecks?.["Dominio Foscal.loc"] || m.softwareChecks?.["Dominio Foscal"] || "",
            sw_ocs: m.softwareChecks?.["OCS Inventory"] || m.softwareChecks?.["ocs inventory"] || "",
            sw_sap: m.softwareChecks?.SAP || m.softwareChecks?.sap || "",
            
            garantia: m.garantia || "",
            vencimientoGarantia: m.vencimientoGarantia || "",
            
            hw_cpu: m.hardwareChecks?.["Limpieza CPU/AIO"] || m.hardwareChecks?.["limpieza cpu/aio"] || "",
            hw_monitor: m.hardwareChecks?.["Limpieza Monitor"] || m.hardwareChecks?.["limpieza monitor"] || "",
            hw_perifericos: m.hardwareChecks?.["Limpieza Periféricos"] || m.hardwareChecks?.["limpieza periféricos"] || "",
            hw_crema: m.hardwareChecks?.["Cambio Crema Disipadora"] || m.hardwareChecks?.["cambio crema disipadora"] || "",
            hw_board: m.hardwareChecks?.["Limpieza board y componentes"] || m.hardwareChecks?.["limpieza board y componentes"] || "",
            hw_portatil: m.hardwareChecks?.["Limpieza Portátil"] || m.hardwareChecks?.["limpieza portátil"] || "",
            
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

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", 'attachment; filename="Reporte_Mantenimientos.xlsx"');
      const buffer = await workbook.xlsx.writeBuffer();
      return res.status(200).send(buffer);
    }

    return res.status(200).json(mantenimientos);
  } catch (error) {
    console.error("❌ Error Grave en el Servidor:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/* ==========================================================================
   2. CREAR REGISTRO (POST)
   ========================================================================== */
export const createMantenimiento = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.softwareChecks) data.softwareChecks = sanitizeData(data.softwareChecks);
    if (data.hardwareChecks) data.hardwareChecks = sanitizeData(data.hardwareChecks);

    const nuevo = new Mantenimiento(data);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear", error: error.message });
  }
};

/* ==========================================================================
   3. ACTUALIZAR REGISTRO (PUT)
   ========================================================================== */
export const updateMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Limpiamos los puntos de las llaves antes de mandar a Mongoose
    if (updateData.softwareChecks) {
        updateData.softwareChecks = sanitizeData(updateData.softwareChecks);
    }
    if (updateData.hardwareChecks) {
        updateData.hardwareChecks = sanitizeData(updateData.hardwareChecks);
    }

    const actualizado = await Mantenimiento.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!actualizado) {
      return res.status(404).json({ message: "Registro no encontrado para editar" });
    }

    res.status(200).json(actualizado);
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

/* ==========================================================================
   4. ELIMINAR REGISTRO (DELETE)
   ========================================================================== */
export const deleteMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await Mantenimiento.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};