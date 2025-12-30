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
    fetch(`${baseUrl}/sedes`).then(r => r.json()).then(setSedes);
    fetch(`${baseUrl}/areas`).then(r => r.json()).then(setAreas);
    fetch(`${baseUrl}/tipos-dispositivos`).then(r => r.json()).then(setDispositivos);
    fetch(`${baseUrl}/funcionarios`).then(r => r.json()).then(setFuncionarios);
    fetch(`${baseUrl}/procesadores`).then(r => r.json()).then(setProcesadores);
    fetch(`${baseUrl}/discos-duros`).then(r => r.json()).then(setDiscos);
    fetch(`${baseUrl}/memorias-ram`).then(r => r.json()).then(setRams);
    fetch(`${baseUrl}/sistemas-operativos`).then(r => r.json()).then(setSistemasOperativos);
  }, []);

  useEffect(() => {
    if (editingRecord) {
      setForm({
        ...initialForm,
        ...editingRecord,
        equipos: editingRecord.equipos || [],
        softwareChecks: { ...initialForm.softwareChecks, ...(editingRecord.softwareChecks || {}) },
        hardwareChecks: { ...initialForm.hardwareChecks, ...(editingRecord.hardwareChecks || {}) },
      });
    } else {
      setForm(initialForm);
    }
  }, [editingRecord]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNestedChange = (group, key, value) =>
    setForm(prev => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  const handleEquipoTempChange = (field, value) =>
    setEquipoTemp(prev => ({ ...prev, [field]: value }));

  const agregarEquipo = () => {
    if (!equipoTemp.nombreEquipo.trim()) {
      alert("Nombre del equipo requerido");
      return;
    }
    setForm(prev => ({ ...prev, equipos: [...prev.equipos, { ...equipoTemp }] }));
    setEquipoTemp({ ...emptyEquipo });
  };

  const quitarEquipo = index =>
    setForm(prev => ({ ...prev, equipos: prev.equipos.filter((_, i) => i !== index) }));

  const handleSubmit = e => {
    e.preventDefault();
    if (form.garantia === "SI" && !form.vencimientoGarantia) {
      alert("Por favor ingrese la fecha de vencimiento de la garantía.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="md-overlay">
      <div className="md-modal">
        <button className="md-btn-close" onClick={onClose}>&times;</button>
        
        <div className="md-modal-content">
          <h2 className="md-title">{editingRecord ? "editar mantenimiento" : "crear mantenimiento"}</h2>

          <form onSubmit={handleSubmit} className="md-form">
            
            {/* ================= DATOS ÁREA ================= */}
            <div className="md-section">
              <h3 className="section-title">Datos Area</h3>
              <div className="row-3">
                <div className="field">
                  <label>Sede</label>
                  <select name="sede" value={form.sede} onChange={handleChange}>
                    <option value="">Sede</option>
                    {sedes.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Area</label>
                  <select name="area" value={form.area} onChange={handleChange}>
                    <option value="">Area</option>
                    {areas.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Ubicación</label>
                  <input name="ubicacion" placeholder="ubicación" value={form.ubicacion} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= DATOS DEL EQUIPO ================= */}
            <div className="md-section">
              <h3 className="section-title">Datos Equipo</h3>
              <div className="row-3">
                <div className="field">
                  <label>Nombre Equipo</label>
                  <input placeholder="nombre equipo" value={equipoTemp.nombreEquipo} onChange={e => handleEquipoTempChange("nombreEquipo", e.target.value)} />
                </div>
                <div className="field">
                  <label>Dispositivo</label>
                  <select value={equipoTemp.dispositivo} onChange={e => handleEquipoTempChange("dispositivo", e.target.value)}>
                    <option value="">Dispositivo</option>
                    {dispositivos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Inventario</label>
                  <input placeholder="inventario" value={equipoTemp.inventario} onChange={e => handleEquipoTempChange("inventario", e.target.value)} />
                </div>
              </div>

              <div className="row-3 mt">
                <div className="field">
                  <label>Procesador</label>
                  <select value={equipoTemp.procesador} onChange={e => handleEquipoTempChange("procesador", e.target.value)}>
                    <option value="">Procesador</option>
                    {procesadores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Disco</label>
                  <select value={equipoTemp.disco} onChange={e => handleEquipoTempChange("disco", e.target.value)}>
                    <option value="">Disco</option>
                    {discos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Ram</label>
                  <select value={equipoTemp.ram} onChange={e => handleEquipoTempChange("ram", e.target.value)}>
                    <option value="">Ram</option>
                    {rams.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="row-3 mt">
                <div className="field">
                  <label>Sistema Operativo</label>
                  <select value={equipoTemp.so} onChange={e => handleEquipoTempChange("so", e.target.value)}>
                    <option value="">Sistema operativo</option>
                    {sistemasOperativos.map(so => (<option key={so.id} value={so.nombre}>{so.nombre}</option>))}
                  </select>
                </div>
              </div>

              <button type="button" className="btn-save mt" onClick={agregarEquipo}>+ Agregar Equipo</button>

              {form.equipos.length > 0 && (
                <div className="equipos-table-wrapper mt">
                  <table className="md-table equipos-table">
                    <thead>
                      <tr>
                        <th className="col-equipo">Equipo</th>
                        <th className="col-dispositivo">Dispositivo</th>
                        <th className="col-inventario">Inventario</th>
                        <th className="col-hw">Procesador</th>
                        <th className="col-hw">Disco</th>
                        <th className="col-hw">Ram</th>
                        <th className="col-so">So</th>
                        <th className="col-accion">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.equipos.map((eq, i) => (
                        <tr key={i}>
                          <td className="col-equipo"><strong>{eq.nombreEquipo}</strong></td>
                          <td className="col-dispositivo">{eq.dispositivo}</td>
                          <td className="col-inventario"><span className="badge-inv">{eq.inventario}</span></td>
                          <td className="col-hw">{eq.procesador}</td>
                          <td className="col-hw">{eq.disco}</td>
                          <td className="col-hw">{eq.ram}</td>
                          <td className="col-so">{eq.so}</td>
                          <td className="col-accion">
                            <button type="button" className="btn-cancel btn-small" onClick={() => quitarEquipo(i)}>quitar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ================= AUTORIZACIÓN RETIRO ================= */}
            <div className="md-section">
              <h3 className="section-title">Autorización Retiro Recibo</h3>
              <div className="row-2">
                <div className="field">
                  <label>Fecha retiro</label>
                  <input type="datetime-local" name="fechaRetiro" value={form.fechaRetiro} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Autoriza retiro</label>
                  <select name="autorizaRetiro" value={form.autorizaRetiro} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="row-2 mt">
                <div className="field">
                  <label>Fecha Entrega</label>
                  <input type="datetime-local" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Recibe</label>
                  <select name="recibe" value={form.recibe} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ================= Fucionarios ================= */}
            <div className="md-section">
              <h3 className="section-title">Funcionarios</h3>
              <div className="row-2">
                <div className="field">
                  <label>Funcionario realiza</label>
                  <select name="funcionarioRealiza" value={form.funcionarioRealiza} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (<option key={f.id} value={f.nombre}>{f.nombre}</option>))}
                  </select>
                </div>
                <div className="field">
                  <label>Fecha Realiza</label>
                  <input type="datetime-local" name="fechaRealiza" value={form.fechaRealiza} onChange={handleChange} />
                </div>
              </div>
              <div className="row-2 mt">
                <div className="field">
                  <label>Funcionario Aprueba</label>
                  <select name="funcionarioAprueba" value={form.funcionarioAprueba} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {funcionarios.map(f => (<option key={f.id} value={f.nombre}>{f.nombre}</option>))}
                  </select>
                </div>
                <div className="field">
                  <label>Fecha aprueba</label>
                  <input type="datetime-local" name="fechaAprueba" value={form.fechaAprueba} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= SOFTWARE ================= */}
            <div className="md-section">
              <h3 className="section-title">Lista Chequeo Software</h3>
              <div className="grid-2">
                {Object.keys(form.softwareChecks).map(k => (
                  <div className="field" key={k}>
                    <label>{k.toLowerCase()}</label>
                    <select value={form.softwareChecks[k]} onChange={e => handleNestedChange("softwareChecks", k, e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option>Verificado</option>
                      <option>No Aplica</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= GARANTÍA ================= */}
            <div className="md-section">
              <h3 className="section-title">Garantía</h3>
              <div className="row-2">
                <div className="field">
                  <label>Equipo en Garantía</label>
                  <select name="garantia" value={form.garantia} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option>SI</option>
                    <option>NO</option>
                  </select>
                </div>
                <div className="field">
                  <label>fecha vencimiento {form.garantia === "SI" && <span style={{color: 'red'}}>*</span>}</label>
                  <input type="date" name="vencimientoGarantia" value={form.vencimientoGarantia} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= HARDWARE ================= */}
            {form.Garantia === "NO" && (
              <div className="md-section">
                <h3 className="section-title">Lista Chequeo Hardware</h3>
                <div className="grid-2">
                  {Object.keys(form.hardwareChecks).map(k => (
                    <div className="field" key={k}>
                      <label>{k.toLowerCase()}</label>
                      <select value={form.hardwareChecks[k]} onChange={e => handleNestedChange("hardwareChecks", k, e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option>Realizado</option>
                        <option>No Aplica</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="field mt">
                  <label>Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* =================  FUNCIONARIO TIC REALIZA ================= */}
            <div className="md-section">
              <h3 className="section-title">Funcionario Tic Realiza Mantenimiento</h3>
              <div className="row-2">
                <div className="field">
                  <label>Funcionario tic</label>
                  <select 
                    name="funcionarioTicMantenimiento" 
                    value={form.funcionarioTicMantenimiento} 
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar Funcionario</option>
                    {funcionarios.map(f => (
                      <option key={f.id} value={f.nombre}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Fecha</label>
                  <input 
                    type="datetime-local" 
                    name="fechaTicMantenimiento" 
                    value={form.fechaTicMantenimiento} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            {/* ================= TIEMPO DE PARADA ================= */}
            <div className="md-section">
              <h3 className="section-title">Tiempo Parada</h3>
              <div className="row-3">
                <div className="field">
                  <label>Minutos parada</label>
                  <input name="minutosParada" value={form.minutosParada} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Proporción (%)</label>
                  <input name="proporcionParada" value={form.proporcionParada} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>total Disponibilidad</label>
                  <input name="totalDisponibilidad" value={form.totalDisponibilidad} onChange={handleChange} />
                </div>
              </div>
              <div className="field mt">
                <label>No. Orden Sap</label>
                <input name="noOrdenSAP" value={form.noOrdenSAP} onChange={handleChange} />
              </div>
            </div>

            <div className="md-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>cancelar</button>
              <button type="submit" className="btn-save">guardar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}