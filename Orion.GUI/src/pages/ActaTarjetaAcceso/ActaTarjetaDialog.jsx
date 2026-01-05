import React, { useState, useEffect } from "react";
import "./ActaTarjetaDialog.css";
import FirmaCanvas from "../../components/FirmaCanvas";

/* ================= API ================= */
const API_TIPO_ENTREGA = `${import.meta.env.VITE_API_URL}/tipos-entrega`;
const API_TIPO_CAMBIO = `${import.meta.env.VITE_API_URL}/tipos-cambio`;
const API_ACTAS = `${import.meta.env.VITE_API_URL}/actas-tarjeta`;

/* ================= FORM BASE ================= */
const initialForm = {
  sede: "",
  tipoEntrega: "",
  tipoCambio: "",
  otraCual: "",
  dia: "",
  mes: "",
  anio: "",
  nombre: "",
  cedula: "",
  correo: "",
  firma: ""
};

export default function ActaTarjetaDialog({ onClose }) {
  const [form, setForm] = useState(initialForm);
  const [tiposEntrega, setTiposEntrega] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MODAL LOCK ================= */
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  /* ================= CARGAR MAESTROS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entregaRes, cambioRes] = await Promise.all([
          fetch(API_TIPO_ENTREGA),
          fetch(API_TIPO_CAMBIO)
        ]);

        setTiposEntrega(await entregaRes.json());
        setTiposCambio(await cambioRes.json());
      } catch (error) {
        console.error("Error cargando maestros:", error);
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firma) {
      alert("Debe registrar la firma digital");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_ACTAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Error al guardar el acta");
      }

      alert(
        "✅ Acta guardada correctamente.\n📧 El PDF fue enviado al correo registrado."
      );

      onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Ocurrió un error al enviar el acta");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TEXTO DINÁMICO ================= */
  const nombreInstitucion =
    form.sede === "foscal"
      ? "FOSCAL"
      : form.sede === "foscal-internacional"
      ? "FUNDACIÓN FOSUNAB"
      : "";

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
                    {tiposEntrega.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Tipo Cambio</label>
                  <select
                    name="tipoCambio"
                    value={form.tipoCambio}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {tiposCambio.map(item => (
                      <option key={item._id} value={item._id}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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

            {/* ================= NORMAS DE USO ================= */}
            {(form.sede === "foscal" || form.sede === "foscal-internacional") && (
              <div className="md-section">
                <h3 className="section-title">Normas de Uso</h3>

                <p>
                  La tarjeta de control de acceso permite el ingreso a áreas
                  restringidas de <b>{nombreInstitucion}</b>, de acuerdo a las
                  funciones del cargo, por lo tanto es de uso personal e
                  intransferible.
                </p>

                <p>
                  En caso de pérdida o hurto deberá notificar inmediatamente a la
                  institución.
                </p>

                <p>
                  La tarjeta es propiedad de la institución y deberá ser devuelta
                  al finalizar la relación contractual.
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
                disabled={loading}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Enviando..." : "Guardar y Enviar"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
