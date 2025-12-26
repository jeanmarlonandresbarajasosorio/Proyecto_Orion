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

  /* ================= BLOQUEAR SCROLL ================= */
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  /* ================= CARGA APIS ================= */
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

  /* ======================================================
      CORRECCIÓN CLAVE — CARGAR DATOS AL EDITAR
     ====================================================== */
  useEffect(() => {
    if (editingRecord) {
      setForm({
        ...initialForm,
        ...editingRecord,
        equipos: editingRecord.equipos || [],
        softwareChecks: {
          ...initialForm.softwareChecks,
          ...(editingRecord.softwareChecks || {}),
        },
        hardwareChecks: {
          ...initialForm.hardwareChecks,
          ...(editingRecord.hardwareChecks || {}),
        },
      });
    } else {
      setForm(initialForm);
    }
  }, [editingRecord]);
  /* ====================================================== */

  /* ================= HANDLERS ================= */
  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNestedChange = (group, key, value) =>
    setForm(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));

  const handleEquipoTempChange = (field, value) =>
    setEquipoTemp(prev => ({ ...prev, [field]: value }));

  const agregarEquipo = () => {
    if (!equipoTemp.nombreEquipo.trim()) {
      alert("Nombre del equipo requerido");
      return;
    }

    setForm(prev => ({
      ...prev,
      equipos: [...prev.equipos, { ...equipoTemp }],
    }));

    setEquipoTemp({ ...emptyEquipo });
  };

  const quitarEquipo = index =>
    setForm(prev => ({
      ...prev,
      equipos: prev.equipos.filter((_, i) => i !== index),
    }));

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  /* ================= UI ================= */
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
                <select name="sede" value={form.sede} onChange={handleChange}>
                  <option value="">Sede</option>
                  {sedes.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                </select>

                <select name="area" value={form.area} onChange={handleChange}>
                  <option value="">Área</option>
                  {areas.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
                </select>

                <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} />
              </div>
            </div>


             {/* ================= DATOS DEL EQUIPO ================= */}
            <div className="md-section">
              <h3>Datos del Equipo</h3>

              <div className="row-3">
                <input placeholder="Nombre Equipo"
                  value={equipoTemp.nombreEquipo}
                  onChange={e => handleEquipoTempChange("nombreEquipo", e.target.value)} />
                
                <select value={equipoTemp.dispositivo}
                  onChange={e => handleEquipoTempChange("dispositivo", e.target.value)}>
                  <option value="">Dispositivo</option>
                  {dispositivos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                </select>

                <input placeholder="Inventario"
                  value={equipoTemp.inventario}
                  onChange={e => handleEquipoTempChange("inventario", e.target.value)} />
              </div>

              <div className="row-3 mt">
                <select value={equipoTemp.procesador}
                  onChange={e => handleEquipoTempChange("procesador", e.target.value)}>
                  <option value="">Procesador</option>
                  {procesadores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>

                <select value={equipoTemp.disco}
                  onChange={e => handleEquipoTempChange("disco", e.target.value)}>
                  <option value="">Disco</option>
                  {discos.map(d => <option key={d.id} value={d.nombre}>{d.nombre}</option>)}
                </select>

                <select value={equipoTemp.ram}
                  onChange={e => handleEquipoTempChange("ram", e.target.value)}>
                  <option value="">RAM</option>
                  {rams.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                </select>
              </div>

              <div className="row-3 mt">
                <select value={equipoTemp.so}
                  onChange={e => handleEquipoTempChange("so", e.target.value)}>
                  <option value="">Sistema Operativo</option>
                  {sistemasOperativos.map(so => (
                    <option key={so.id} value={so.nombre}>{so.nombre}</option>
                  ))}
                </select>
              </div>

              <button type="button" className="btn-save mt" onClick={agregarEquipo}>
                + Agregar Equipo
              </button>

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
          <th className="col-hw">RAM</th>
          <th className="col-so">SO</th>
        </tr>
      </thead>
       
      <tbody>
        
        {form.equipos.map((eq, i) => (
          <tr key={i}>
            <td className="col-equipo">
              <strong>{eq.nombreEquipo}</strong>
            </td>

            <td className="col-dispositivo">
              {eq.dispositivo}
            </td>

            <td className="col-inventario">
              <span className="badge-inv">{eq.inventario}</span>
            </td>

            <td className="col-hw">{eq.procesador}</td>
            <td className="col-hw">{eq.disco}</td>
            <td className="col-hw">{eq.ram}</td>
            <td className="col-so">{eq.so}</td>
            

            <td className="col-accion">
              <button
                type="button"
                className="btn-cancel btn-small"
                onClick={() => quitarEquipo(i)}
              >
                Quitar
              </button>
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
              <h3>Autorización de Retiro y Recibo</h3>

              <div className="row-2">
                <input type="datetime-local" name="fechaRetiro" value={form.fechaRetiro} onChange={handleChange} />
                <select name="autorizaRetiro" value={form.autorizaRetiro} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {funcionarios.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                </select>
              </div>

              <div className="row-2 mt">
                <input type="datetime-local" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} />
                <select name="recibe" value={form.recibe} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {funcionarios.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                </select>
              </div>
            </div>

            {/* ================= FUNCIONARIOS ================= */}
         <div className="md-section">
              <h3>Funcionarios</h3>

              <div className="row-2">
                <div className="field">
                  <label>Seleccionar</label>
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
                  <select key={k} value={form.softwareChecks[k]}
                    onChange={e => handleNestedChange("softwareChecks", k, e.target.value)}>
                    <option value="">{k}</option>
                    <option>Verificado</option>
                    <option>No aplica</option>
                  </select>
                ))}
              </div>
            </div>

            {/* ================= GARANTÍA ================= */}
            <div className="md-section">
              <h3>Garantía</h3>
              <div className="row-2">
                <select name="garantia" value={form.garantia} onChange={handleChange}>
                  <option value="">¿Equipo en garantía?</option>
                  <option>SI</option>
                  <option>NO</option>
                </select>

                <input type="date" name="vencimientoGarantia"
                  value={form.vencimientoGarantia} onChange={handleChange} />
              </div>
            </div>

            {/* ================= HARDWARE ================= */}
            {form.garantia === "NO" && (
              <div className="md-section">
                <h3>Lista de Chequeo de Hardware</h3>
                <div className="grid-2">
                  {Object.keys(form.hardwareChecks).map(k => (
                    <select key={k}
                      value={form.hardwareChecks[k]}
                      onChange={e => handleNestedChange("hardwareChecks", k, e.target.value)}>
                      <option value="">{k}</option>
                      <option>Realizado</option>
                      <option>No aplica</option>
                    </select>
                  ))}
                </div>

                <textarea
                  placeholder="Observaciones"
                  value={form.observaciones}
                  onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
                />
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
              <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-save">Guardar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
