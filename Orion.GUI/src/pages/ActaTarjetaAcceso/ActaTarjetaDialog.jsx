import React, { useState, useEffect } from "react";
import "./ActaTarjetaDialog.css";
import FirmaCanvas from "../../components/FirmaCanvas";

const API_TIPO_ENTREGA = `${import.meta.env.VITE_API_URL}/tipos-entrega`;
const API_TIPO_CAMBIO = `${import.meta.env.VITE_API_URL}/tipos-cambio`;
const API_ACTAS = `${import.meta.env.VITE_API_URL}/actas-tarjeta`;

const initialForm = {
  sede: "",
  tipoEntrega: "",
  tipoCambio: "",
  otraCual: "",
  dia: "",
  mes: "",
  anio: "",
  nombre: "",
  cedula: "",
  correo: "",
  firma: ""
};

export default function ActaTarjetaDialog({ onClose }) {
  const [form, setForm] = useState(initialForm);
  const [tiposEntrega, setTiposEntrega] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entregaRes, cambioRes] = await Promise.all([
          fetch(API_TIPO_ENTREGA),
          fetch(API_TIPO_CAMBIO)
        ]);
        setTiposEntrega(await entregaRes.json());
        setTiposCambio(await cambioRes.json());
      } catch (error) {
        console.error("Error cargando maestros:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firma) {
      alert("Debe registrar la firma digital");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(API_ACTAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar el acta");
      alert("✅ Acta guardada correctamente.\n📧 El PDF fue enviado al correo registrado.");
      onClose();
    } catch (error) {
      alert("❌ Ocurrió un error al enviar el acta");
    } finally {
      setLoading(false);
    }
  };

  const nombreInstitucion = form.sede === "foscal" 
    ? "FOSCAL" 
    : form.sede === "foscal-internacional" 
      ? "FUNDACIÓN FOSUNAB" 
      : "LA INSTITUCIÓN";

  return (
    <div className="modal-backdrop">
      <form className="modal-card" onSubmit={handleSubmit}>
        <header className="modal-header">
          <h2>Acta de Entrega – Tarjeta Control de Acceso</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </header>

        <section className="modal-body">
          <div className="permissions-section">
            <div className="permission-title">Datos Generales</div>
            <div className="form-grid">
              <label>
                Sede
                <select name="sede" value={form.sede} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  <option value="foscal">Foscal</option>
                  <option value="foscal-internacional">Foscal Internacional</option>
                </select>
              </label>

              <label>
                Tipo Entrega
                <select name="tipoEntrega" value={form.tipoEntrega} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  {tiposEntrega.map(item => (
                    <option key={item._id} value={item._id}>{item.nombre}</option>
                  ))}
                </select>
              </label>

              <label>
                Tipo Cambio
                <select name="tipoCambio" value={form.tipoCambio} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  {tiposCambio.map(item => (
                    <option key={item._id} value={item._id}>{item.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid" style={{ marginTop: '16px' }}>
              <label>Día <input name="dia" value={form.dia} onChange={handleChange} required /></label>
              <label>Mes <input name="mes" value={form.mes} onChange={handleChange} required /></label>
              <label>Año <input name="anio" value={form.anio} onChange={handleChange} required /></label>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Normas de Uso y Aceptación</div>
            <div className="permission-group">
              <p style={{ color: '#1e293b', fontWeight: '600', marginBottom: '10px', fontSize: '13px' }}>
                Al firmar este documento se da constancia de la recepción y aceptación de:
              </p>
              <ul className="normas-list">
                <li>Obligación de custodiar la tarjeta; el titular es responsable del uso indebido.</li>
                <li>La tarjeta permite ingreso a áreas de <b>{nombreInstitucion}</b>; es personal e intransferible.</li>
                <li>Pérdida o hurto debe notificarse inmediatamente (Ext. 6191 - 6192).</li>
                <li>En caso de daño o pérdida, se debe cancelar el valor establecido.</li>
                <li>Debe ser entregada en la <b>Subgerencia de Tecnología</b> al finalizar el contrato.</li>
              </ul>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Datos del Responsable</div>
            <div className="form-grid">
              <label>Nombre Completo <input name="nombre" value={form.nombre} onChange={handleChange} required /></label>
              <label>Número de Cédula <input name="cedula" value={form.cedula} onChange={handleChange} required /></label>
              <label>Correo Electrónico <input type="email" name="correo" value={form.correo} onChange={handleChange} required /></label>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Firma Digital</div>
            <div className="permission-group" style={{ background: '#fff' }}>
              <FirmaCanvas onSave={(firma) => setForm(prev => ({ ...prev, firma }))} />
              {form.firma && (
                <div className="permissions-warning" style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46', marginTop: '10px' }}>
                  ✔ Firma registrada correctamente
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Guardar y Enviar Acta"}
          </button>
        </footer>
      </form>
    </div>
  );
}