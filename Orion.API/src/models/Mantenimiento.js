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

/* ================= MANTENIMIENTO ================= */
const MantenimientoSchema = new mongoose.Schema(
  {
    sede: String,
    area: String,
    ubicacion: String,

    // 🔥 CLAVE: MÚLTIPLES EQUIPOS
    equipos: [EquipoSchema],

    fechaRetiro: Date,
    autorizaRetiro: String,
    fechaEntrega: Date,
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
    vencimientoGarantia: Date,

    hardwareChecks: {
      "Limpieza CPU/AIO": String,
      "Limpieza Monitor": String,
      "Limpieza Periféricos": String,
      "Cambio Crema Disipadora": String,
      "Limpieza board y componentes": String,
      "Limpieza Portátil": String,
    },

    observaciones: String,

    minutosParada: Number,
    proporcionParada: Number,
    totalDisponibilidad: Number,

    funcionarioRealiza: String,
    fechaRealiza: Date,
    funcionarioAprueba: String,
    fechaAprueba: Date,

    noOrdenSAP: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mantenimiento", MantenimientoSchema);
