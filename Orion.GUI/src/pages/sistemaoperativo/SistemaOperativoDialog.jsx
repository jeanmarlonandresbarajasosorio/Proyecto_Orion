import React, { useState, useEffect } from "react";
import "./SistemaOperativoDialog.css";

export default function SistemaOperativoDialog({
  onClose,
  onSave,
  editingRecord,
}) {
  const [form, setForm] = useState({
    _id: null,
    nombre: "",
    estado: true,
  });

  useEffect(() => {
    if (editingRecord) {
      setForm({
        _id: editingRecord._id,
        nombre: editingRecord.nombre || "",
        estado: editingRecord.estado,
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "estado") {
      setForm((prev) => ({ ...prev, estado: value === "true" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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
          <h2>
            {form._id ? "Editar Sistema Operativo" : "Nuevo Sistema Operativo"}
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <section className="permissions-section">
              <div className="permission-title">Información del Software</div>
              <div className="permission-group">
                <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <label>
                    Nombre del Sistema Operativo
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
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Cambios
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}