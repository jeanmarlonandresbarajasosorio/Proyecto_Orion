import React, { useState, useEffect } from "react";
import "./ActaTarjetaDialog.css";
import FirmaCanvas from "../../components/FirmaCanvas";

const initialForm = {
  sede: "",
  tipoEntrega: "",
  otraCual: "",
  dia: "",
  mes: "",
  anio: "",
  nombre: "",
  cedula: "",
  correo: "",
  firma: ""
};

export default function ActaTarjetaDialog({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.firma) {
      alert("Debe registrar la firma digital");
      return;
    }

    onSave(form);
  };

  return (
    <div className="md-overlay">
      <div className="md-modal">
        <button className="md-btn-close" onClick={onClose}>
          &times;
        </button>

        <div className="md-modal-content">
          <h2 className="md-title">
            Acta de Entrega – Tarjeta Control de Acceso
          </h2>

          <form onSubmit={handleSubmit} className="md-form">

            {/* ================= DATOS GENERALES ================= */}
            <div className="md-section">
              <h3 className="section-title">Datos Generales</h3>

              <div className="row-3">
                <div className="field">
                  <label>Sede</label>
                  <select name="sede" value={form.sede} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="foscal">Foscal</option>
                    <option value="foscal-internacional">Foscal Internacional</option>
                  </select>
                </div>

                <div className="field">
                  <label>Tipo Entrega</label>
                  <select
                    name="tipoEntrega"
                    value={form.tipoEntrega}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="PRIMERA_VEZ">Primera vez</option>
                    <option value="CAMBIO_DANO">Cambio por daño</option>
                    <option value="CAMBIO_PERDIDA">Cambio por pérdida</option>
                    <option value="OTRA">Otra</option>
                  </select>
                </div>

                {form.tipoEntrega === "OTRA" && (
                  <div className="field">
                    <label>¿Cuál?</label>
                    <input
                      name="otraCual"
                      value={form.otraCual}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="row-3 mt">
                <div className="field">
                  <label>Día</label>
                  <input name="dia" value={form.dia} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Mes</label>
                  <input name="mes" value={form.mes} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Año</label>
                  <input name="anio" value={form.anio} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= TEXTO CONDICIONAL ================= */}
            {form.sede === "foscal-internacional" && (
              <div className="md-section">
                <h3 className="section-title">Normas de Uso</h3>

                <p>
                  La tarjeta de control de acceso permite el ingreso a algunas
                  áreas restringidas de <b>FUNDACIÓN FOSUNAB</b> de acuerdo a las
                  funciones del cargo de la persona que recibe la misma, por lo
                  tanto es de uso personal e intransferible.
                </p>

                <p>
                  En caso de pérdida o hurto deberá notificar inmediatamente a la
                  institución. Outsourcing - Vigilancia 6191 - 6192.
                </p>

                <p>
                  La tarjeta es propiedad de la institución y deberá ser
                  devuelta al finalizar el contrato laboral.
                </p>
              </div>
            )}

            {/* ================= RESPONSABLE ================= */}
            <div className="md-section">
              <h3 className="section-title">Datos del Responsable</h3>

              <div className="row-2">
                <div className="field">
                  <label>Nombre Completo</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Número de Cédula</label>
                  <input
                    name="cedula"
                    value={form.cedula}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field mt">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ================= FIRMA ================= */}
            <div className="md-section">
              <h3 className="section-title">Firma Digital</h3>

              <FirmaCanvas
                onSave={(firma) =>
                  setForm(prev => ({ ...prev, firma }))
                }
              />

              {form.firma && (
                <small style={{ color: "green" }}>
                  ✔ Firma registrada correctamente
                </small>
              )}
            </div>

            {/* ================= ACCIONES ================= */}
            <div className="md-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-save">
                Guardar y Enviar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
