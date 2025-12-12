import React, { useState, useEffect } from "react";
import "./SistemaOperativoDialog.css";

export default function SistemaOperativoDialog({ onClose, onSave, editingRecord }) {
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

  const handleSubmit = () => {
    let updated = { ...form };

    if (form.id) {
      updated.fecha_modificacion = new Date().toISOString();
      updated.usuario_modifica = "admin";
    }

    onSave(updated);
    onClose();
  };

  return (
    <div className="md-overlay">
      <div className="md-modal">
        <div className="md-modal-content">

          <h2>{form.id ? "Editar Sistema Operativo" : "Nuevo Sistema Operativo"}</h2>

          <div className="md-form row-2">
            <div>
              <label>Nombre</label>
              <input
                className="mui-input"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="md-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              Guardar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
