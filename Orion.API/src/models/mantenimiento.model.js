import mongoose from "mongoose";

const MantenimientoSchema = new mongoose.Schema(
  {
    sede: String,
    area: String,
    ubicacion: String,

    dispositivo: String,
    inventario: String,
    nombreEquipo: String,
    disco: String,
    ram: String,
    procesador: String,
    so: String,

    fechaRetiro: Date,
    autorizaRetiro: String,
    fechaEntrega: Date,
    recibe: String,

    softwareChecks: Object,
    hardwareChecks: Object,

    garantia: String,
    vencimientoGarantia: Date,

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
