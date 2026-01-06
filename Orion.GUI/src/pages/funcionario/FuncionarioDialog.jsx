import React, { useState, useEffect } from "react";
import "./FuncionarioDialog.css";

export default function FuncionarioDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    estado: true,
  });

  useEffect(() => {
    if (editingRecord) setForm(editingRecord);
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

    let updated = { ...form };

    if (form.id) {
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
          <h2>{form.id ? "Editar Funcionario" : "Nuevo Funcionario"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <section className="permissions-section">
              <div className="permission-title">Datos del Personal</div>
              <div className="permission-group">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <label>
                    Nombre Completo
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
                Guardar Registro
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}