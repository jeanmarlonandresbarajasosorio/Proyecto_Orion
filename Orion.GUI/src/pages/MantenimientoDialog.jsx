import React, { useState, useEffect } from "react";
import "./MantenimientoDialog.css";

const initialForm = {
  sede: "",
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

  const [sedes, setSedes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sistemasOperativos, setSistemasOperativos] = useState([]);

  useEffect(() => {
    if (editingRecord) setForm(editingRecord);
  }, [editingRecord]);

  useEffect(() => {
    fetch("http://localhost:3001/api/sedes").then(r => r.json()).then(setSedes);
    fetch("http://localhost:3001/api/areas").then(r => r.json()).then(setAreas);
    fetch("http://localhost:3001/api/tipos-dispositivos").then(r => r.json()).then(setDispositivos);
    fetch("http://localhost:3001/api/funcionarios").then(r => r.json()).then(setFuncionarios);
    fetch("http://localhost:3001/api/sistemas-operativos").then(r => r.json()).then(setSistemasOperativos);
  }, []);

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

            {/* ================= DATOS ÁREA ================= */}
            <div className="md-section">
              <h3>Datos del Área</h3>
              <div className="row-3">
                <div className="field">
                  <label>Sede</label>
                  <select name="sede" value={form.sede} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {sedes.map(s => (
                      <option key={s.id} value={s.nombre}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Área</label>
                  <select name="area" value={form.area} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {areas.map(a => (
                      <option key={a.id} value={a.nombre}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Ubicación</label>
                  <input name="ubicacion" value={form.ubicacion} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= DATOS EQUIPO ================= */}
            <div className="md-section">
              <h3>Datos del Equipo</h3>

              <div className="field">
                <label>Nombre del Equipo</label>
                <input name="nombreEquipo" value={form.nombreEquipo} onChange={handleChange} />
              </div>

              <div className="row-3">
                <div className="field">
                  <label>Dispositivo</label>
                  <select name="dispositivo" value={form.dispositivo} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {dispositivos.map(d => (
                      <option key={d.id} value={d.nombre}>{d.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>No. Inventario</label>
                  <input name="inventario" value={form.inventario} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Procesador</label>
                  <input name="procesador" value={form.procesador} onChange={handleChange} />
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
                  <label>Sistema Operativo</label>
                  <select name="so" value={form.so} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {sistemasOperativos.map(so => (
                      <option key={so.id} value={so.nombre}>{so.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

                        <div className="md-section">
              <h3>Autorización de Retiro y Recibo</h3>

              <div className="row-2">
                <div className="field">
                  <label>Fecha y Hora Retiro</label>
                  <input type="datetime-local" name="fechaRetiro" value={form.fechaRetiro} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Funcionario que Autoriza</label>
                  <select name="autorizaRetiro" value={form.autorizaRetiro} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.nombre}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row-2 mt">
                <div className="field">
                  <label>Fecha y Hora Entrega</label>
                  <input type="datetime-local" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Funcionario que Recibe</label>
                  <select name="recibe" value={form.recibe} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.nombre}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="md-section">
              <h3>Funcionarios</h3>

              <div className="row-2">
                <div className="field">
                  <label>Funcionario Realiza</label>
                  <select
                    name="funcionarioRealiza"
                    value={form.funcionarioRealiza}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.nombre}>
                        {f.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Fecha Realiza</label>
                  <input
                    type="datetime-local"
                    name="fechaRealiza"
                    value={form.fechaRealiza}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row-2 mt">
                <div className="field">
                  <label>Funcionario Aprueba</label>
                  <select
                    name="funcionarioAprueba"
                    value={form.funcionarioAprueba}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.nombre}>
                        {f.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Fecha Aprueba</label>
                  <input
                    type="datetime-local"
                    name="fechaAprueba"
                    value={form.fechaAprueba}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>


            {/* ================= SOFTWARE ================= */}
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

            {/* ================= GARANTÍA ================= */}
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
                  <input
                    type="date"
                    name="vencimientoGarantia"
                    value={form.vencimientoGarantia}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ================= HARDWARE ================= */}
            {form.garantia === "NO" && (
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
            )}

            {/* ================= TIEMPO DE PARADA (AGREGADO AL FINAL) ================= */}
            <div className="md-section">
              <h3>Tiempo de Parada</h3>

              <div className="row-3">
                <div className="field">
                  <label>Minutos Parada</label>
                  <input
                    name="minutosParada"
                    value={form.minutosParada}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Proporción (%)</label>
                  <input
                    name="proporcionParada"
                    value={form.proporcionParada}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Total Minutos Disponibles</label>
                  <input
                    name="totalDisponibilidad"
                    value={form.totalDisponibilidad}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <label>No. Orden SAP</label>
                <input
                  name="noOrdenSAP"
                  value={form.noOrdenSAP}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ================= ACCIONES ================= */}
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
