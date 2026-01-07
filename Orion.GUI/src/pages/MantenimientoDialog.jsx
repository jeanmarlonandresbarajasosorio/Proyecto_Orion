import React, { useState, useEffect } from "react";
import "./MantenimientoDialog.css";

/* ================= EQUIPO BASE ================= */
const emptyEquipo = {
  nombreEquipo: "",
  dispositivo: "",
  inventario: "",
  procesador: "",
  disco: "",
  ram: "",
  so: "",
};

/* ================= FORM BASE ================= */
const initialForm = {
  sede: "",
  area: "",
  ubicacion: "",
  equipos: [],
  fechaRetiro: "",
  autorizaRetiro: "",
  fechaEntrega: "",
  recibe: "",
  funcionarioRealiza: "",
  fechaRealiza: "",
  funcionarioAprueba: "",
  fechaAprueba: "",
  softwareChecks: {
    Antivirus: "",
    "Nombre del computador": "",
    "Actualizaciones de Windows": "",
    "Dominio Foscal loc": "", // CORREGIDO: Sin punto para evitar error Mongoose
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
  funcionarioTicMantenimiento: "",
  fechaTicMantenimiento: "",
  minutosParada: "",
  proporcionParada: "",
  totalDisponibilidad: "",
  noOrdenSAP: "",
};

export default function MantenimientoDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState(initialForm);
  const [equipoTemp, setEquipoTemp] = useState(emptyEquipo);

  const [sedes, setSedes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [procesadores, setProcesadores] = useState([]);
  const [discos, setDiscos] = useState([]);
  const [rams, setRams] = useState([]);
  const [sistemasOperativos, setSistemasOperativos] = useState([]);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const fetchAll = async () => {
      try {
        const [resSedes, resAreas, resDisp, resFunc, resProc, resDisc, resRam, resSo] = await Promise.all([
          fetch(`${baseUrl}/sedes`).then(r => r.json()),
          fetch(`${baseUrl}/areas`).then(r => r.json()),
          fetch(`${baseUrl}/tipos-dispositivos`).then(r => r.json()),
          fetch(`${baseUrl}/funcionarios`).then(r => r.json()),
          fetch(`${baseUrl}/procesadores`).then(r => r.json()),
          fetch(`${baseUrl}/discos-duros`).then(r => r.json()),
          fetch(`${baseUrl}/memorias-ram`).then(r => r.json()),
          fetch(`${baseUrl}/sistemas-operativos`).then(r => r.json()),
        ]);
        setSedes(resSedes);
        setAreas(resAreas);
        setDispositivos(resDisp);
        setFuncionarios(resFunc);
        setProcesadores(resProc);
        setDiscos(resDisc);
        setRams(resRam);
        setSistemasOperativos(resSo);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (editingRecord) {
      // Normalización para manejar datos viejos con punto y evitar errores
      const sanitizedSW = {};
      const rawSW = editingRecord.softwareChecks || {};
      
      // Mapeamos lo que venga del server al nuevo formato sin puntos
      Object.keys(initialForm.softwareChecks).forEach(key => {
        const oldKeyWithDot = key.replace(" loc", ".loc");
        sanitizedSW[key] = rawSW[key] || rawSW[oldKeyWithDot] || "";
      });

      const normalizedRecord = {
        ...initialForm,
        ...editingRecord,
        id: editingRecord.id || editingRecord._id,
        softwareChecks: sanitizedSW,
        hardwareChecks: { 
          ...initialForm.hardwareChecks, 
          ...(editingRecord.hardwareChecks || {}) 
        },
        equipos: editingRecord.equipos || []
      };
      setForm(normalizedRecord);
    } else {
      setForm(initialForm);
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === null ? "" : value,
    }));
  };

  const handleNestedChange = (group, key, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handleEquipoTempChange = (field, value) =>
    setEquipoTemp((prev) => ({ ...prev, [field]: value }));

  const agregarEquipo = () => {
    if (!equipoTemp.nombreEquipo.trim()) {
      alert("Nombre del equipo requerido");
      return;
    }
    setForm((prev) => ({
      ...prev,
      equipos: [...prev.equipos, { ...equipoTemp }],
    }));
    setEquipoTemp({ ...emptyEquipo });
  };

  const quitarEquipo = (index) =>
    setForm((prev) => ({
      ...prev,
      equipos: prev.equipos.filter((_, i) => i !== index),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.garantia === "SI" && !form.vencimientoGarantia) {
      alert("Por favor ingrese la fecha de vencimiento de la garantía.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <header className="modal-header">
          <h2>{editingRecord ? "Editar Mantenimiento" : "Crear Mantenimiento"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* ================= DATOS ÁREA ================= */}
            <section className="permissions-section">
              <div className="permission-title">Datos del Área</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Sede
                    <select name="sede" value={form.sede || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {sedes.map((s) => (
                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Área
                    <select name="area" value={form.area || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.nombre}>{a.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Ubicación
                    <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion || ""} onChange={handleChange} />
                  </label>
                </div>
              </div>
            </section>

            {/* ================= DATOS DEL EQUIPO ================= */}
            <section className="permissions-section">
              <div className="permission-title">Datos del Equipo</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Nombre Equipo
                    <input placeholder="Nombre Equipo" value={equipoTemp.nombreEquipo || ""} onChange={(e) => handleEquipoTempChange("nombreEquipo", e.target.value)} />
                  </label>
                  <label>Dispositivo
                    <select value={equipoTemp.dispositivo || ""} onChange={(e) => handleEquipoTempChange("dispositivo", e.target.value)}>
                      <option value="">Seleccionar</option>
                      {dispositivos.map((d) => (
                        <option key={d.id} value={d.nombre}>{d.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Inventario
                    <input placeholder="Inventario" value={equipoTemp.inventario || ""} onChange={(e) => handleEquipoTempChange("inventario", e.target.value)} />
                  </label>
                  <label>Procesador
                    <select value={equipoTemp.procesador || ""} onChange={(e) => handleEquipoTempChange("procesador", e.target.value)}>
                      <option value="">Seleccionar</option>
                      {procesadores.map((p) => (
                        <option key={p.id} value={p.nombre}>{p.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Disco
                    <select value={equipoTemp.disco || ""} onChange={(e) => handleEquipoTempChange("disco", e.target.value)}>
                      <option value="">Seleccionar</option>
                      {discos.map((d) => (
                        <option key={d.id} value={d.nombre}>{d.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>RAM
                    <select value={equipoTemp.ram || ""} onChange={(e) => handleEquipoTempChange("ram", e.target.value)}>
                      <option value="">Seleccionar</option>
                      {rams.map((r) => (
                        <option key={r.id} value={r.nombre}>{r.nombre}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-grid" style={{ marginTop: "10px" }}>
                  <label>Sistema Operativo
                    <select value={equipoTemp.so || ""} onChange={(e) => handleEquipoTempChange("so", e.target.value)}>
                      <option value="">Seleccionar</option>
                      {sistemasOperativos.map((so) => (
                        <option key={so.id} value={so.nombre}>{so.nombre}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <button type="button" className="btn-primary" style={{ marginTop: "16px", width: "100%" }} onClick={agregarEquipo}>+ Agregar Equipo</button>

                {form.equipos && form.equipos.length > 0 && (
                  <div style={{ marginTop: "16px", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead style={{ background: "#f1f5f9" }}>
                        <tr>
                          <th style={{ padding: "8px", textAlign: "left" }}>Equipo</th>
                          <th style={{ padding: "8px", textAlign: "left" }}>Inventario</th>
                          <th style={{ padding: "8px", textAlign: "left" }}>HW</th>
                          <th style={{ padding: "8px", textAlign: "left" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.equipos.map((eq, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "8px" }}>{eq.nombreEquipo}</td>
                            <td style={{ padding: "8px" }}><span className="badge-inv">{eq.inventario}</span></td>
                            <td style={{ padding: "8px" }}>{eq.procesador} / {eq.ram}</td>
                            <td style={{ padding: "8px" }}>
                              <button type="button" style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "600" }} onClick={() => quitarEquipo(i)}>Quitar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* ================= RETIRO Y RECIBO ================= */}
            <section className="permissions-section">
              <div className="permission-title">Autorización Retiro y Recibo</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Fecha retiro
                    <input type="datetime-local" name="fechaRetiro" value={form.fechaRetiro || ""} onChange={handleChange} />
                  </label>
                  <label>Autoriza retiro
                    <select name="autorizaRetiro" value={form.autorizaRetiro || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Fecha Entrega
                    <input type="datetime-local" name="fechaEntrega" value={form.fechaEntrega || ""} onChange={handleChange} />
                  </label>
                  <label>Recibe
                    <select name="recibe" value={form.recibe || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </section>

            {/* ================= SOFTWARE ================= */}
            <section className="permissions-section">
              <div className="permission-title">Lista Chequeo Software</div>
              <div className="permission-group">
                <div className="form-grid">
                  {Object.keys(form.softwareChecks).map((k) => (
                    <label key={k}>{k}
                      <select value={form.softwareChecks[k] || ""} onChange={(e) => handleNestedChange("softwareChecks", k, e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option>Verificado</option>
                        <option>No Aplica</option>
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* ================= GARANTÍA Y HW ================= */}
            <section className="permissions-section">
              <div className="permission-title">Garantía y Hardware</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Equipo en Garantía
                    <select name="garantia" value={form.garantia || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      <option>SI</option>
                      <option>NO</option>
                    </select>
                  </label>
                  <label>Fecha vencimiento {form.garantia === "SI" && <span style={{ color: "red" }}>*</span>}
                    <input type="date" name="vencimientoGarantia" value={form.vencimientoGarantia || ""} onChange={handleChange} />
                  </label>
                </div>

                {form.garantia === "NO" && (
                  <div style={{ marginTop: "20px" }}>
                    <p className="help-text">Checklist Hardware (Mantenimiento Preventivo):</p>
                    <div className="form-grid">
                      {Object.keys(form.hardwareChecks).map((k) => (
                        <label key={k}>{k}
                          <select value={form.hardwareChecks[k] || ""} onChange={(e) => handleNestedChange("hardwareChecks", k, e.target.value)}>
                            <option value="">Seleccionar</option>
                            <option>Realizado</option>
                            <option>No Aplica</option>
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "15px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}>Observaciones</label>
                  <textarea name="observaciones" style={{ width: "100%", marginTop: "6px", borderRadius: "10px", border: "1px solid #cbd5e1", padding: "10px" }} value={form.observaciones || ""} onChange={handleChange} rows="3" />
                </div>
              </div>
            </section>

            {/* ================= FUNCIONARIOS ================= */}
            <section className="permissions-section">
              <div className="permission-title">Responsables del Proceso</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Funcionario TIC
                    <select name="funcionarioTicMantenimiento" value={form.funcionarioTicMantenimiento || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Fecha TIC
                    <input type="datetime-local" name="fechaTicMantenimiento" value={form.fechaTicMantenimiento || ""} onChange={handleChange} />
                  </label>
                  <label>Funcionario Realiza
                    <select name="funcionarioRealiza" value={form.funcionarioRealiza || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Fecha Realiza
                    <input type="datetime-local" name="fechaRealiza" value={form.fechaRealiza || ""} onChange={handleChange} />
                  </label>
                  <label>Funcionario Aprueba
                    <select name="funcionarioAprueba" value={form.funcionarioAprueba || ""} onChange={handleChange}>
                      <option value="">Seleccionar</option>
                      {funcionarios.map((f) => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>Fecha Aprueba
                    <input type="datetime-local" name="fechaAprueba" value={form.fechaAprueba || ""} onChange={handleChange} />
                  </label>
                </div>
              </div>
            </section>

            {/* ================= DISPONIBILIDAD ================= */}
            <section className="permissions-section">
              <div className="permission-title">Disponibilidad y SAP</div>
              <div className="permission-group">
                <div className="form-grid">
                  <label>Minutos parada
                    <input name="minutosParada" value={form.minutosParada || ""} onChange={handleChange} />
                  </label>
                  <label>Proporción (%)
                    <input name="proporcionParada" value={form.proporcionParada || ""} onChange={handleChange} />
                  </label>
                  <label>Total Disponibilidad
                    <input name="totalDisponibilidad" value={form.totalDisponibilidad || ""} onChange={handleChange} />
                  </label>
                  <label>No. Orden SAP
                    <input name="noOrdenSAP" value={form.noOrdenSAP || ""} onChange={handleChange} />
                  </label>
                </div>
              </div>
            </section>

            <footer className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary">
                {editingRecord ? "Actualizar Registro" : "Guardar Registro"}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}