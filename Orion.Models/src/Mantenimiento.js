const mongoose = require("mongoose");

const MantenimientoSchema = new mongoose.Schema(
  {
    area: String,
    sede: String,
    ubicacion: String,
    dispositivo: String,
    inventario: String,
    nombreEquipo: String,
    disco: String,
    ram: String,
    procesador: String,
    so: String,
    fechaRetiro: String,
    autorizaRetiro: String,
    fechaEntrega: String,
    recibe: String,

    softwareChecks: {
      Antivirus: String,
      "Nombre del computador": String,
      "Actualizaciones de Windows": String,
      "Dominio Foscal.loc": String,
      "OCS Inventory": String,
      SAP: String,
    },

    garantia: String,
    vencimientoGarantia: String,

    hardwareChecks: {
      "Limpieza CPU/AIO": String,
      "Limpieza Monitor": String,
      "Limpieza Periféricos": String,
      "Cambio Crema Disipadora": String,
      "Limpieza board y componentes": String,
      "Limpieza Portátil": String,
    },

    observaciones: String,

    minutosParada: String,
    proporcionParada: String,
    totalDisponibilidad: String,

    funcionarioRealiza: String,
    fechaRealiza: String,
    funcionarioAprueba: String,
    fechaAprueba: String,
    noOrdenSAP: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mantenimiento", MantenimientoSchema);
