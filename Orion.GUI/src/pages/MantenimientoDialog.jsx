import React, { useState, useEffect } from "react";
import "./MantenimientoDialog.css";

const initialForm = {
  sede: "",          // <-- NUEVO CAMPO
  area: "",
  ubicacion: "",
  dispositivo: "",
  inventario: "",
  nombreEquipo: "",
  disco: "",
  ram: "",
  procesador: "",
  so: "",
  fechaRetiro: "",
  autorizaRetiro: "",
  fechaEntrega: "",
  recibe: "",
  softwareChecks: {
    Antivirus: "",
    "Nombre del computador": "",
    "Actualizaciones de Windows": "",
    "Dominio Foscal.loc": "",
    "OCS Inventory": "",
    SAP: "",
  },
  garantia: "",
  vencimientoGarantia: "",
  hardwareChecks: {
    "Limpieza CPU/AIO": "",
    "Limpieza Monitor": "",
    "Limpieza Periféricos": "",
    "Cambio Crema Disipadora": "",
    "Limpieza board y componentes": "",
    "Limpieza Portátil": "",
  },
  observaciones: "",
  minutosParada: "",
  proporcionParada: "",
  totalDisponibilidad: "",
  funcionarioRealiza: "",
  fechaRealiza: "",
  funcionarioAprueba: "",
  fechaAprueba: "",
  noOrdenSAP: "",
};

export default function MantenimientoDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingRecord) {
      setForm(editingRecord);
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNestedChange = (group, key, value) => {
    setForm(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="md-overlay">
      <div className="md-modal">
        <div className="md-modal-content">

          <h2>{editingRecord ? "Editar Mantenimiento" : "Crear Mantenimiento"}</h2>

          <form onSubmit={handleSubmit} className="md-form">

            {/* DATOS DEL ÁREA */}
            <div className="md-section">
              <h3>Datos del Área</h3>

              {/* 3 columnas: Sede, Área, Ubicación */}
              <div className="row-3">
                <div className="field">
                  <label>Sede</label>
                  <input
                    name="sede"
                    value={form.sede}
                    onChange={handleChange}
                    placeholder="Ej: Foscal, Foscal Internacional"
                  />
                </div>

                <div className="field">
                  <label>Área</label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Ubicación</label>
                  <input
                    name="ubicacion"
                    value={form.ubicacion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* DATOS DEL EQUIPO */}
            <div className="md-section">
              <h3>Datos del Equipo</h3>

              <div className="row-3">
                <div className="field">
                  <label>Dispositivo</label>
                  <select name="dispositivo" value={form.dispositivo} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option>Monitor</option>
                    <option>CPU/AIO</option>
                    <option>Portátil</option>
                  </select>
                </div>

                <div className="field">
                  <label>No. Inventario</label>
                  <input name="inventario" value={form.inventario} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Nombre del Equipo</label>
                  <input name="nombreEquipo" value={form.nombreEquipo} onChange={handleChange} />
                </div>
              </div>

              <div className="row-3 mt">
                <div className="field">
                  <label>Disco Duro</label>
                  <input name="disco" value={form.disco} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Memoria RAM</label>
                  <input name="ram" value={form.ram} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Procesador</label>
                  <input name="procesador" value={form.procesador} onChange={handleChange} />
                </div>
              </div>

              <div className="row-1 mt">
                <div className="field">
                  <label>Sistema Operativo</label>
                  <input name="so" value={form.so} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* AUTORIZACIÓN */}
            <div className="md-section">
              <h3>Autorización de Retiro y Recibo</h3>

              <div className="row-2">
                <div className="field">
                  <label>Fecha y Hora Retiro</label>
                  <input type="datetime-local" name="fechaRetiro" value={form.fechaRetiro} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Funcionario que Autoriza</label>
                  <input name="autorizaRetiro" value={form.autorizaRetiro} onChange={handleChange} />
                </div>
              </div>

              <div className="row-2 mt">
                <div className="field">
                  <label>Fecha y Hora Entrega</label>
                  <input type="datetime-local" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Funcionario que Recibe</label>
                  <input name="recibe" value={form.recibe} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* SOFTWARE CHECK */}
            <div className="md-section">
              <h3>Lista de Chequeo de Software</h3>

              <div className="grid-2">
                {Object.keys(form.softwareChecks).map(k => (
                  <div className="field" key={k}>
                    <label>{k}</label>
                    <select
                      value={form.softwareChecks[k]}
                      onChange={e => handleNestedChange("softwareChecks", k, e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option>Verificado</option>
                      <option>No aplica</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* GARANTÍA */}
            <div className="md-section">
              <h3>Garantía</h3>

              <div className="row-3">
                <div className="field">
                  <label>¿Equipo en garantía?</label>
                  <select name="garantia" value={form.garantia} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option>SI</option>
                    <option>NO</option>
                  </select>
                </div>

                <div className="field">
                  <label>Fecha Vencimiento</label>
                  <input type="date" name="vencimientoGarantia" value={form.vencimientoGarantia} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>No. Orden SAP</label>
                  <input name="noOrdenSAP" value={form.noOrdenSAP} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* HARDWARE CHECK */}
            <div className="md-section">
              <h3>Lista de Chequeo de Hardware</h3>

              <div className="grid-2">
                {Object.keys(form.hardwareChecks).map(k => (
                  <div className="field" key={k}>
                    <label>{k}</label>
                    <select
                      value={form.hardwareChecks[k]}
                      onChange={e => handleNestedChange("hardwareChecks", k, e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option>Realizado</option>
                      <option>No aplica</option>
                    </select>
                  </div>
                ))}

                <div className="field full">
                  <label>Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* TIEMPO DE PARADA */}
            <div className="md-section">
              <h3>Tiempo de Parada</h3>

              <div className="row-3">
                <div className="field">
                  <label>Minutos Parada</label>
                  <input name="minutosParada" value={form.minutosParada} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Proporción (%)</label>
                  <input name="proporcionParada" value={form.proporcionParada} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Total Minutos Disponibles</label>
                  <input name="totalDisponibilidad" value={form.totalDisponibilidad} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* FUNCIONARIOS */}
            <div className="md-section">
              <h3>Funcionarios</h3>

              <div className="row-2">
                <div className="field">
                  <label>Funcionario Realiza</label>
                  <input name="funcionarioRealiza" value={form.funcionarioRealiza} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Fecha Realiza</label>
                  <input type="datetime-local" name="fechaRealiza" value={form.fechaRealiza} onChange={handleChange} />
                </div>
              </div>

              <div className="row-2 mt">
                <div className="field">
                  <label>Funcionario Aprueba</label>
                  <input name="funcionarioAprueba" value={form.funcionarioAprueba} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Fecha Aprueba</label>
                  <input type="datetime-local" name="fechaAprueba" value={form.fechaAprueba} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="md-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" className="btn-save">
                Guardar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
