import mongoose from "mongoose";

const actaTarjetaSchema = new mongoose.Schema({
  sede: { type: String, required: true },
  tipoEntrega: { type: String, required: true },
  tipoCambio: { type: String, required: true }, 
  otraCual: { type: String },                    
  
  dia: { type: String, required: true },
  mes: { type: String, required: true },
  anio: { type: String, required: true },

  nombre: { type: String, required: true },
  cedula: { type: String, required: true },
  correo: { type: String, required: true },
  firma: { type: String, required: true }, 

  funcionarioEntrega: { type: String },
  cargo: { type: String },
  area: { type: String },
  numeroTarjeta: { type: String },
  fechaEntrega: { type: Date },
  fechaDevolucion: { type: Date },

}, { 
  timestamps: true 
});

export default mongoose.model("ActaTarjeta", actaTarjetaSchema);