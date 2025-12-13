import React, { useState, useEffect } from "react";
import "./ChequeoDialog.css";

export default function ChequeoDialog({ onClose, onSave, editingRecord }) {
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
        estado:
          typeof editingRecord.estado === "boolean"
            ? editingRecord.estado
            : true,
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updated = {
      ...form,
      estado: typeof form.estado === "boolean" ? form.estado : true,
    };

    if (form._id) {
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

          <h2>{form._id ? "Editar Chequeo" : "Nuevo Chequeo"}</h2>

          <div className="md-form row-2">
            <div>
              <label>Nombre</label>
              <input
                className="mui-input"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del chequeo"
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
