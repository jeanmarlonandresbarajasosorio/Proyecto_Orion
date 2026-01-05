import React, { useState, useEffect } from "react";
import "./TipoEntregaDialog.css";

export default function TipoEntregaDialog({
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
    if (!form.nombre.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="md-overlay">
      <div className="md-modal">
        <div className="md-modal-content">

          <h2>
            {form._id ? "Editar Tipo de Entrega" : "Nuevo Tipo de Entrega"}
          </h2>

          <div className="md-form row-2">
            <div>
              <label>Nombre</label>
              <input
                className="mui-input"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                autoFocus
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
