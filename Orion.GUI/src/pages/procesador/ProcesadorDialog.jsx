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

  const handleSubmit = () => {
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
    <div className="md-overlay">
      <div className="md-modal">
        <div className="md-modal-content">
          <h2>{form._id ? "Editar Procesador" : "Nuevo Procesador"}</h2>

          <div className="md-form row-1">
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
