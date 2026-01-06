import React, { useState, useEffect } from "react";
import "./AreaDialog.css";

export default function AreaDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState({
    _id: null,
    nombre: "",
    estado: true,
  });

  useEffect(() => {
    if (editingRecord) {
      setForm(editingRecord);
    } else {
      setForm({
        _id: null,
        nombre: "",
        estado: true,
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "estado") {
      setForm({ ...form, estado: value === "true" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;

    const updated = { ...form };

    if (form._id) {
      updated.fecha_modificacion = new Date().toISOString();
      updated.usuario_modifica = "admin";
    }

    onSave(updated);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ width: "500px" }}>
        <header className="modal-header">
          <h2>{form._id ? "Editar Área" : "Nueva Área"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <section className="permissions-section">
              <div className="permission-title">Estructura Organizacional</div>
              <div className="permission-group">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <label>
                    Nombre del Área
                    <input
                      type="text"
                      name="nombre"
                      placeholder=""
                      value={form.nombre}
                      onChange={handleChange}
                      autoFocus
                      required
                    />
                  </label>
                </div>
              </div>
            </section>

            <footer className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Área
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}