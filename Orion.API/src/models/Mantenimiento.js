import mongoose from "mongoose";

/* ================= SUBSCHEMA EQUIPO ================= */
const EquipoSchema = new mongoose.Schema(
  {
    nombreEquipo: String,
    dispositivo: String,
    inventario: String,
    procesador: String,
    disco: String,
    ram: String,
    so: String,
  },
  { _id: false }
);

/* ================= SCHEMA PRINCIPAL MANTENIMIENTO ================= */
const MantenimientoSchema = new mongoose.Schema(
  {
    sede: String,
    area: String,
    ubicacion: String,
    equipos: [EquipoSchema],

    fechaRetiro: Date,
    autorizaRetiro: String,
    fechaEntrega: Date,
    recibe: String,

    funcionarioRealiza: String,
    fechaRealiza: Date,
    funcionarioAprueba: String,
    fechaAprueba: Date,

    // AJUSTADO: Claves con Mayúsculas para coincidir con el Frontend
    softwareChecks: {
      Antivirus: String,
      "Nombre del computador": String,
      "Actualizaciones de Windows": String,
      "Dominio Foscal.loc": String,
      "OCS Inventory": String,
      SAP: String,
    },

    garantia: String, 
    vencimientoGarantia: Date,

    // AJUSTADO: Claves con Mayúsculas para coincidir con el Frontend
    hardwareChecks: {
      "Limpieza CPU/AIO": String,
      "Limpieza Monitor": String,
      "Limpieza Periféricos": String,
      "Cambio Crema Disipadora": String,
      "Limpieza board y componentes": String,
      "Limpieza Portátil": String,
    },

    observaciones: String,

    funcionarioTicMantenimiento: String,
    fechaTicMantenimiento: Date,

    minutosParada: String,
    proporcionParada: String,
    totalDisponibilidad: String,
    noOrdenSAP: String,
  },
  { 
    timestamps: true, 
    versionKey: false 
  }
);

export default mongoose.model(
  "Mantenimiento",
  MantenimientoSchema,
  "mantenimientos"
);