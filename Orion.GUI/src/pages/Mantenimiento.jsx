import React, { useState, useEffect } from "react";

/**
 * Mantenimiento.jsx
 * Módulo FRONTEND (solo UI) - formulario largo con secciones en tarjetas.
 * Guarda en localStorage bajo la key "mantenimientos_orion".
 */

const initialForm = {
  // Datos del área
  area: "",
  dependencia: "",
  responsableArea: "",
  fechaIngreso: "",
  ciudad: "",
  sede: "",
  observacionesGenerales: "",

  // Datos del equipo
  tipoEquipo: "",
  marca: "",
  modelo: "",
  serial: "",
  codigoInterno: "",
  ubicacionEquipo: "",
  monitor: "",
  configPC: "",
  procesador: "",
  sistemaOperativo: "",

  // Mantenimiento / orden
  numeroOrdenSap: "",
  motivo: "",
  tecnicoAsignado: "",
  tipoMantenimiento: "Preventivo", // Preventivo / Correctivo
  requiereRepuestos: "No", // Si/No
  tiempoEstimadoHoras: "",

  // Checklist Software (booleans)
  sw_nombreComputador: false,
  sw_dominio: false,
  sw_usuarioAdmin: false,
  sw_antivirus: false,
  sw_navegador: false,
  sw_impresion: false,
  sw_actualizaciones: false,
  sw_office: false,
  sw_backups: false,
  sw_red: false,
  sw_rendimiento: false,

  // Checklist Hardware (boolean)
  hw_keyboard: false,
  hw_mouse: false,
  hw_pantalla: false,
  hw_cpu: false,
  hw_unidades: false,
  hw_perifericos: false,
  hw_ventilacion: false,
  hw_limpieza: false,
  hw_cables: false,
  hw_fuente: false,

  // Resultados / estado
  estatus: "Pendiente", // Pendiente/En proceso/Completado
  estadoFinal: "",
  observacionesFinales: "",

  // Firmas simples
  firmaNombre: "",
  firmaFecha: "",
  firmaImagenUrl: ""
};

export default function Mantenimiento() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState([]);

  // cargar registros guardados
  useEffect(() => {
    const raw = localStorage.getItem("mantenimientos_orion");
    if (raw) setSaved(JSON.parse(raw));
  }, []);

  // helper para actualizar campos
  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // validar campos requeridos
  const validate = () => {
    const e = {};
    if (!form.area?.trim()) e.area = "Área es requerida";
    if (!form.tipoEquipo?.trim()) e.tipoEquipo = "Tipo de equipo es requerido";
    if (!form.motivo?.trim()) e.motivo = "Motivo es requerido";
    if (!form.tecnicoAsignado?.trim()) e.tecnicoAsignado = "Técnico asignado requerido";
    if (!form.fechaIngreso?.trim()) e.fechaIngreso = "Fecha de ingreso requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const entry = {
      id: Date.now(),
      ...form
    };
    const updated = [entry, ...saved];
    setSaved(updated);
    localStorage.setItem("mantenimientos_orion", JSON.stringify(updated));
    alert("Registro guardado (simulado).");
    setForm(initialForm);
  };

  const onDelete = (id) => {
    if (!confirm("Eliminar registro?")) return;
    const updated = saved.filter((s) => s.id !== id);
    setSaved(updated);
    localStorage.setItem("mantenimientos_orion", JSON.stringify(updated));
  };

  return (
    <div className="mantenimiento-page">
      <h2 className="page-title">Mantenimiento Preventivo / Correctivo</h2>

      <form onSubmit={onSave} className="mantenimiento-form">

        {/* DATOS DEL ÁREA */}
        <section className="card section">
          <h3>1. Datos del Área</h3>
          <div className="row">
            <div className="field">
              <label>Área / Dependencia *</label>
              <input value={form.area} onChange={(e) => setField("area", e.target.value)} />
              {errors.area && <small className="error">{errors.area}</small>}
            </div>

            <div className="field">
              <label>Responsable</label>
              <input value={form.responsableArea} onChange={(e) => setField("responsableArea", e.target.value)} />
            </div>

            <div className="field">
              <label>Fecha de Ingreso *</label>
              <input type="date" value={form.fechaIngreso} onChange={(e) => setField("fechaIngreso", e.target.value)} />
              {errors.fechaIngreso && <small className="error">{errors.fechaIngreso}</small>}
            </div>

            <div className="field">
              <label>Ciudad</label>
              <input value={form.ciudad} onChange={(e) => setField("ciudad", e.target.value)} />
            </div>

            <div className="field">
              <label>Sede</label>
              <input value={form.sede} onChange={(e) => setField("sede", e.target.value)} />
            </div>

            <div className="field full">
              <label>Observaciones generales</label>
              <textarea value={form.observacionesGenerales} onChange={(e) => setField("observacionesGenerales", e.target.value)} />
            </div>
          </div>
        </section>

        {/* DATOS DEL EQUIPO */}
        <section className="card section">
          <h3>2. Datos del Equipo</h3>
          <div className="row">
            <div className="field">
              <label>Tipo de equipo *</label>
              <input value={form.tipoEquipo} onChange={(e) => setField("tipoEquipo", e.target.value)} />
              {errors.tipoEquipo && <small className="error">{errors.tipoEquipo}</small>}
            </div>

            <div className="field">
              <label>Marca</label>
              <input value={form.marca} onChange={(e) => setField("marca", e.target.value)} />
            </div>

            <div className="field">
              <label>Modelo</label>
              <input value={form.modelo} onChange={(e) => setField("modelo", e.target.value)} />
            </div>

            <div className="field">
              <label>Serial</label>
              <input value={form.serial} onChange={(e) => setField("serial", e.target.value)} />
            </div>

            <div className="field">
              <label>Código interno</label>
              <input value={form.codigoInterno} onChange={(e) => setField("codigoInterno", e.target.value)} />
            </div>

            <div className="field">
              <label>Ubicación</label>
              <input value={form.ubicacionEquipo} onChange={(e) => setField("ubicacionEquipo", e.target.value)} />
            </div>

            <div className="field">
              <label>Monitor</label>
              <input value={form.monitor} onChange={(e) => setField("monitor", e.target.value)} />
            </div>

            <div className="field">
              <label>Configuración del PC</label>
              <input value={form.configPC} onChange={(e) => setField("configPC", e.target.value)} />
            </div>

            <div className="field">
              <label>Procesador</label>
              <input value={form.procesador} onChange={(e) => setField("procesador", e.target.value)} />
            </div>

            <div className="field">
              <label>Sistema Operativo</label>
              <input value={form.sistemaOperativo} onChange={(e) => setField("sistemaOperativo", e.target.value)} />
            </div>
          </div>
        </section>

        {/* DATOS DE MANTENIMIENTO */}
        <section className="card section">
          <h3>3. Información del Mantenimiento</h3>
          <div className="row">
            <div className="field">
              <label>Número Orden SAP</label>
              <input value={form.numeroOrdenSap} onChange={(e) => setField("numeroOrdenSap", e.target.value)} />
            </div>

            <div className="field">
              <label>Motivo *</label>
              <input value={form.motivo} onChange={(e) => setField("motivo", e.target.value)} />
              {errors.motivo && <small className="error">{errors.motivo}</small>}
            </div>

            <div className="field">
              <label>Técnico asignado *</label>
              <input value={form.tecnicoAsignado} onChange={(e) => setField("tecnicoAsignado", e.target.value)} />
              {errors.tecnicoAsignado && <small className="error">{errors.tecnicoAsignado}</small>}
            </div>

            <div className="field">
              <label>Tipo de Mantenimiento</label>
              <select value={form.tipoMantenimiento} onChange={(e) => setField("tipoMantenimiento", e.target.value)}>
                <option>Preventivo</option>
                <option>Correctivo</option>
              </select>
            </div>

            <div className="field">
              <label>Requiere repuestos</label>
              <select value={form.requiereRepuestos} onChange={(e) => setField("requiereRepuestos", e.target.value)}>
                <option>No</option>
                <option>Sí</option>
              </select>
            </div>

            <div className="field">
              <label>Tiempo estimado (horas)</label>
              <input type="number" min="0" value={form.tiempoEstimadoHoras} onChange={(e) => setField("tiempoEstimadoHoras", e.target.value)} />
            </div>

            <div className="field full">
              <label>Observaciones finales</label>
              <textarea value={form.observacionesFinales} onChange={(e) => setField("observacionesFinales", e.target.value)} />
            </div>
          </div>
        </section>

        {/* CHECKLIST SOFTWARE */}
        <section className="card section">
          <h3>4. Lista de Chequeo - Software</h3>

          <div className="check-grid">
            {[
              ["sw_nombreComputador", "Verificar nombre del computador"],
              ["sw_dominio", "Verificar dominio Foscal.loc"],
              ["sw_usuarioAdmin", "Verificar usuario administrador"],
              ["sw_antivirus", "Verificar antivirus"],
              ["sw_navegador", "Verificar navegador"],
              ["sw_impresion", "Verificar impresión"],
              ["sw_actualizaciones", "Verificar actualizaciones"],
              ["sw_office", "Verificar Office y activación"],
              ["sw_backups", "Copias de seguridad"],
              ["sw_red", "Conexión a red"],
              ["sw_rendimiento", "Rendimiento general"]
            ].map(([key, label]) => (
              <label className="checkbox" key={key}>
                <input type="checkbox" checked={!!form[key]} onChange={(e) => setField(key, e.target.checked)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* CHECKLIST HARDWARE */}
        <section className="card section">
          <h3>5. Lista de Chequeo - Hardware</h3>

          <div className="check-grid">
            {[
              ["hw_keyboard", "Keyboard"],
              ["hw_mouse", "Mouse"],
              ["hw_pantalla", "Pantalla"],
              ["hw_cpu", "CPU"],
              ["hw_unidades", "Unidades de disco"],
              ["hw_perifericos", "Periféricos"],
              ["hw_ventilacion", "Ventilación"],
              ["hw_limpieza", "Limpieza interna"],
              ["hw_cables", "Cables"],
              ["hw_fuente", "Fuente de poder"]
            ].map(([key, label]) => (
              <label className="checkbox" key={key}>
                <input type="checkbox" checked={!!form[key]} onChange={(e) => setField(key, e.target.checked)} />
                <span>{label}</span>
              </label>
            ))}
          </div>

        </section>

        {/* ESTATUS Y FIRMAS */}
        <section className="card section">
          <h3>6. Estado / Firmas</h3>
          <div className="row">
            <div className="field">
              <label>Estatus</label>
              <select value={form.estatus} onChange={(e) => setField("estatus", e.target.value)}>
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Completado</option>
              </select>
            </div>

            <div className="field">
              <label>Estado final</label>
              <input value={form.estadoFinal} onChange={(e) => setField("estadoFinal", e.target.value)} />
            </div>

            <div className="field">
              <label>Firma - Nombre</label>
              <input value={form.firmaNombre} onChange={(e) => setField("firmaNombre", e.target.value)} />
            </div>

            <div className="field">
              <label>Firma - Fecha</label>
              <input type="date" value={form.firmaFecha} onChange={(e) => setField("firmaFecha", e.target.value)} />
            </div>

            <div className="field full">
              <label>URL de firma (imagen opcional)</label>
              <input value={form.firmaImagenUrl} onChange={(e) => setField("firmaImagenUrl", e.target.value)} />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn primary">Guardar registro</button>
          <button type="button" className="btn neutral" onClick={() => setForm(initialForm)}>Limpiar</button>
        </div>
      </form>

      {/* LISTADO DE REGISTROS GUARDADOS */}
      <section className="card section">
        <h3>Registros guardados</h3>
        {saved.length === 0 ? (
          <p className="muted">No hay registros guardados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Área</th>
                  <th>Equipo</th>
                  <th>Técnico</th>
                  <th>Tipo</th>
                  <th>Estatus</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {saved.map((s) => (
                  <tr key={s.id}>
                    <td>{s.fechaIngreso || "-"}</td>
                    <td>{s.area || "-"}</td>
                    <td>{s.tipoEquipo || s.marca || "-"}</td>
                    <td>{s.tecnicoAsignado || "-"}</td>
                    <td>{s.tipoMantenimiento || "-"}</td>
                    <td>{s.estatus || "-"}</td>
                    <td>
                      <button className="btn small" onClick={() => {
                        const ok = confirm("Cargar registro en el formulario para editar?");
                        if (!ok) return;
                        setForm(saved.find(x => x.id === s.id) || initialForm);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}>Editar</button>
                      <button className="btn danger small" onClick={() => onDelete(s.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
