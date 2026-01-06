import React, { useState, useEffect } from "react";
import "./ProcesadorDialog.css";

export default function ProcesadorDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState({
    _id: null,
    nombre: "",
  });

  useEffect(() => {
    if (editingRecord) {
      setForm({
        _id: editingRecord._id || null,
        nombre: editingRecord.nombre || "",
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    let payload = {
      nombre: form.nombre,
    };

    if (form._id) {
      payload._id = form._id;
      payload.fecha_modificacion = new Date().toISOString();
      payload.usuario_modifica = "admin";
    } else {
      payload.fecha_creacion = new Date().toISOString();
      payload.usuario_creacion = "admin";
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ width: "500px" }}>
        <header className="modal-header">
          <h2>{form._id ? "Editar Procesador" : "Nuevo Procesador"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <section className="permissions-section">
              <div className="permission-title">Especificaciones de Hardware</div>
              <div className="permission-group">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <label>
                    Nombre del Procesador
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
                Guardar Procesador
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}