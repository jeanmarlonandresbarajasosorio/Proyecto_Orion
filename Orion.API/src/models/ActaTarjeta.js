import mongoose from "mongoose";

const actaTarjetaSchema = new mongoose.Schema({
  correo: String,
  nombre: String,
  cedula: String,
  sede: String,
  dia: Number,
  mes: Number,
  anio: Number,
  firma: String,
  funcionarioEntrega: String,
  cargo: String,
  area: String,
  numeroTarjeta: String,
  fechaEntrega: Date,
  fechaDevolucion: Date,
}, { timestamps: true });

export default mongoose.model("ActaTarjeta", actaTarjetaSchema);
