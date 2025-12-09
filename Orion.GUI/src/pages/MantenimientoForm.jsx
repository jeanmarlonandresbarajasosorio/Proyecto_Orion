import React, { useEffect, useState } from "react";
import "./MantenimientoForm.css";

const initialForm = {
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

export default function MantenimientoForm() {
  const [form, setForm] = useState(initialForm);
  const [savedRecords, setSavedRecords] = useState([]);
  const [saved, setSaved] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [results, setResults] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setResults(savedRecords);
  }, [savedRecords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleNestedChange = (group, key, value) => {
    setForm(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.area) err.area = "Área es requerida";
    if (!form.nombreEquipo) err.nombreEquipo = "Nombre del equipo es requerido";
    if (form.dispositivo && !form.inventario) err.inventario = "No. inventario requerido";
    return err;
  };

  const computeMinutesDiff = (start, end) => {
    if (!start || !end) return "";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e) || e < s) return "";
    const diffMs = e - s;
    return Math.round(diffMs / 60000); 
  };

  const handleSave = () => {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const minutos = computeMinutesDiff(form.fechaRetiro, form.fechaEntrega);

    const record = {
      ...form,
      minutosParada: minutos || form.minutosParada,
      savedAt: new Date().toISOString(),
      id: Date.now(),
    };

    if (editingIndex !== null) {
      setSavedRecords(prev => prev.map((r, i) => (i === editingIndex ? record : r)));
      setEditingIndex(null);
    } else {
      setSavedRecords(prev => [record, ...prev]);
    }

    setSaved(true);
    setResults(prev => [record, ...prev]); 
  };

  const handleSearch = () => {
    let arr = [...savedRecords];
    if (filterTipo) arr = arr.filter(r => r.dispositivo === filterTipo);
    if (searchText) {
      const q = searchText.toLowerCase();
      arr = arr.filter(r =>
        (r.nombreEquipo || "").toLowerCase().includes(q) ||
        (r.inventario || "").toLowerCase().includes(q) ||
        (r.autorizaRetiro || "").toLowerCase().includes(q)
      );
    }
    setResults(arr);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilterTipo("");
    setResults(savedRecords);
  };

  const handleDelete = (id) => {
    const arr = savedRecords.filter(r => r.id !== id);
    setSavedRecords(arr);
    setResults(arr);
  };

  const handleEdit = (id) => {
    const idx = savedRecords.findIndex(r => r.id === id);
    if (idx === -1) return;
    setForm(savedRecords[idx]);
    setEditingIndex(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mui-container page-content">
      <h1 className="mui-title">Mantenimiento Preventivo</h1>

      <div className="mui-grid">
        {/* Left column: form */}
        <div className="mui-column form-column">

          {/* AREA */}
          <div className="mui-card">
            <div className="mui-card-header">Datos del Área</div>
            <div className="mui-card-body">
              <div className="row-2">
                <div className="field">
                  <label>Área</label>
                  <input name="area" value={form.area} onChange={handleChange} className="mui-input" />
                  {errors.area && <div className="error">{errors.area}</div>}
                </div>
                <div className="field">
                  <label>Ubicación</label>
                  <input name="ubicacion" value={form.ubicacion} onChange={handleChange} className="mui-input" />
                </div>
              </div>
            </div>
          </div>

          {/* EQUIPO */}
          <div className="mui-card">
            <div className="mui-card-header">Datos del Equipo</div>
            <div className="mui-card-body">
              <div className="row-3">
                <div className="field">
                  <label>Dispositivo</label>
                  <select name="dispositivo" value={form.dispositivo} onChange={handleChange} className="mui-select">
                    <option value="">Seleccionar</option>
                    <option>Monitor</option>
                    <option>CPU/AIO</option>
                    <option>Portátil</option>
                  </select>
                </div>

                <div className="field">
                  <label>No. Inventario</label>
                  <input name="inventario" value={form.inventario} onChange={handleChange} className="mui-input" />
                  {errors.inventario && <div className="error">{errors.inventario}</div>}
                </div>

                <div className="field">
                  <label>Nombre del Equipo</label>
                  <input name="nombreEquipo" value={form.nombreEquipo} onChange={handleChange} className="mui-input" />
                  {errors.nombreEquipo && <div className="error">{errors.nombreEquipo}</div>}
                </div>
              </div>

              <div className="row-3 mt">
                <div className="field"><label>Disco Duro</label><input name="disco" value={form.disco} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Memoria RAM</label><input name="ram" value={form.ram} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Procesador</label><input name="procesador" value={form.procesador} onChange={handleChange} className="mui-input" /></div>
              </div>

              <div className="row-1 mt">
                <div className="field"><label>Sistema Operativo</label><input name="so" value={form.so} onChange={handleChange} className="mui-input" /></div>
              </div>
            </div>
          </div>

          {/* Retiro / Entrega */}
          <div className="mui-card">
            <div className="mui-card-header">Autorización de Retiro y Recibo</div>
            <div className="mui-card-body">
              <div className="row-2">
                <div className="field"><label>Fecha y Hora Retiro</label><input name="fechaRetiro" type="datetime-local" value={form.fechaRetiro} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Funcionario que Autoriza</label><input name="autorizaRetiro" value={form.autorizaRetiro} onChange={handleChange} className="mui-input" /></div>
              </div>

              <div className="row-2 mt">
                <div className="field"><label>Fecha y Hora Entrega</label><input name="fechaEntrega" type="datetime-local" value={form.fechaEntrega} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Funcionario que Recibe</label><input name="recibe" value={form.recibe} onChange={handleChange} className="mui-input" /></div>
              </div>
            </div>
          </div>

          {/* SOFTWARE */}
          <div className="mui-card">
            <div className="mui-card-header">Lista de Chequeo de Software</div>
            <div className="mui-card-body grid-2">
              {Object.keys(form.softwareChecks).map(k => (
                <div className="field" key={k}>
                  <label>{k}</label>
                  <select value={form.softwareChecks[k]} onChange={(e) => handleNestedChange("softwareChecks", k, e.target.value)} className="mui-select">
                    <option value="">Seleccionar</option>
                    <option>Verificado</option>
                    <option>No aplica</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* GARANTIA */}
          <div className="mui-card">
            <div className="mui-card-header">Garantía</div>
            <div className="mui-card-body">
              <div className="row-3">
                <div className="field">
                  <label>¿Equipo en garantía?</label>
                  <select name="garantia" value={form.garantia} onChange={handleChange} className="mui-select">
                    <option value="">Seleccionar</option>
                    <option>SI</option>
                    <option>NO</option>
                  </select>
                </div>
                <div className="field">
                  <label>Fecha vencimiento garantía</label>
                  <input name="vencimientoGarantia" type="date" value={form.vencimientoGarantia} onChange={handleChange} className="mui-input" />
                </div>
                <div className="field">
                  <label>No. Orden SAP</label>
                  <input name="noOrdenSAP" value={form.noOrdenSAP} onChange={handleChange} className="mui-input" />
                </div>
              </div>
            </div>
          </div>

          {/* HARDWARE */}
          <div className="mui-card">
            <div className="mui-card-header">Lista de Chequeo de Hardware</div>
            <div className="mui-card-body grid-2">
              {Object.keys(form.hardwareChecks).map(k => (
                <div className="field" key={k}>
                  <label>{k}</label>
                  <select value={form.hardwareChecks[k]} onChange={(e) => handleNestedChange("hardwareChecks", k, e.target.value)} className="mui-select">
                    <option value="">Seleccionar</option>
                    <option>Realizado</option>
                    <option>No aplica</option>
                  </select>
                </div>
              ))}
              <div className="field full">
                <label>Observaciones</label>
                <textarea className="mui-textarea" name="observaciones" value={form.observaciones} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* TIEMPO DE PARADA */}
          <div className="mui-card">
            <div className="mui-card-header">Tiempo de Parada</div>
            <div className="mui-card-body">
              <div className="row-3">
                <div className="field"><label>Minutos de Parada</label><input name="minutosParada" value={form.minutosParada} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Proporción (%)</label><input name="proporcionParada" value={form.proporcionParada} onChange={handleChange} className="mui-input" /></div>
                <div className="field"><label>Total Minutos Disponibilidad</label><input name="totalDisponibilidad" value={form.totalDisponibilidad} onChange={handleChange} className="mui-input" /></div>
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="mui-actions">
            <button className="mui-btn mui-btn-primary" onClick={handleSave}>Guardar</button>

            <button
              className={`mui-btn mui-btn-secondary ${saved ? "enabled" : "disabled"}`}
              onClick={handleSearch}
              disabled={!saved}
            >
              Buscar
            </button>

            <button className="mui-btn mui-btn-ghost" onClick={() => { setForm(initialForm); setEditingIndex(null); }}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Right column: resultados / busqueda */}
        <div className="mui-column results-column">
          <div className="results-card mui-card">
            <div className="mui-card-header">Buscar registros</div>
            <div className="mui-card-body">
              <div className="row-2">
                <input placeholder="Buscar por nombre, inventario o funcionario" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="mui-input" />
                <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="mui-select">
                  <option value="">Filtrar por dispositivo</option>
                  <option>Monitor</option>
                  <option>CPU/AIO</option>
                  <option>Portátil</option>
                </select>
              </div>

              <div className="row-2 mt">
                <button className="mui-btn mui-btn-primary" onClick={handleSearch} disabled={!saved}>Buscar</button>
                <button className="mui-btn mui-btn-ghost" onClick={handleClearSearch}>Limpiar</button>
              </div>
            </div>
          </div>

          <div className="results-list mui-card">
            <div className="mui-card-header">Resultados ({results.length})</div>
            <div className="mui-card-body">
              {results.length === 0 ? (
                <div className="muted">No hay registros. Guarda un mantenimiento para empezar.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Equipo</th>
                        <th>Inventario</th>
                        <th>Fecha Retiro</th>
                        <th>Minutos Parada</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(r => (
                        <tr key={r.id}>
                          <td>{String(r.id).slice(-6)}</td>
                          <td>{r.nombreEquipo}</td>
                          <td>{r.inventario}</td>
                          <td>{r.fechaRetiro ? new Date(r.fechaRetiro).toLocaleString() : "-"}</td>
                          <td>{r.minutosParada || "-"}</td>
                          <td>
                            <button className="small btn neutral" onClick={() => handleEdit(r.id)}>Editar</button>
                            <button className="small btn primary" onClick={() => { /* view action */ window.alert(JSON.stringify(r, null, 2)); }}>Ver</button>
                            <button className="small btn danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
