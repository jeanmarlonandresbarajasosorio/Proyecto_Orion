import React, { useState, useEffect } from "react";
import "./ActaTarjetaDialog.css";
import FirmaCanvas from "../../components/FirmaCanvas";
import { sendActaTarjetaEmail } from "../../services/email.service";

const API_TIPO_ENTREGA = `${import.meta.env.VITE_API_URL}/tipos-entrega`;
const API_TIPO_CAMBIO = `${import.meta.env.VITE_API_URL}/tipos-cambio`;
const API_FUNCIONARIOS = `${import.meta.env.VITE_API_URL}/funcionarios`;

const initialForm = {
  sede: "",
  tipoEntrega: "",
  tipoCambio: "",
  numeroTarjeta: "",
  entregadoPor: "",
  otraCual: "",
  dia: new Date().getDate().toString(),
  mes: (new Date().getMonth() + 1).toString(),
  anio: new Date().getFullYear().toString(),
  nombre: "",
  cedula: "",
  correo: "",
  firma: ""
};

export default function ActaTarjetaDialog({ onClose, onSave, editingRecord }) {
  const [form, setForm] = useState(initialForm);
  const [tiposEntrega, setTiposEntrega] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entregaRes, cambioRes, funcionariosRes] = await Promise.all([
          fetch(API_TIPO_ENTREGA),
          fetch(API_TIPO_CAMBIO),
          fetch(API_FUNCIONARIOS)
        ]);

        const dataEntrega = await entregaRes.json();
        const dataCambio = await cambioRes.json();
        const dataFuncionarios = await funcionariosRes.json();

        setTiposEntrega(dataEntrega);
        setTiposCambio(dataCambio);
        setFuncionarios(dataFuncionarios);

        if (editingRecord) {
          setForm({
            ...editingRecord,
            tipoEntrega: editingRecord.tipoEntrega?._id || editingRecord.tipoEntrega,
            tipoCambio: editingRecord.tipoCambio?._id || editingRecord.tipoCambio,
            entregadoPor: editingRecord.entregadoPor?._id || editingRecord.entregadoPor,
            dia: editingRecord.dia?.toString() || "",
            mes: editingRecord.mes?.toString() || "",
            anio: editingRecord.anio?.toString() || ""
          });
        }
      } catch (error) {
        console.error("Error cargando maestros:", error);
      }
    };

    fetchData();
  }, [editingRecord]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firma) {
      alert("Debe registrar la firma digital");
      return;
    }

    try {
      setLoading(true);

      const nombreEntrega = tiposEntrega.find(t => t._id === form.tipoEntrega)?.nombre;
      const nombreCambio = tiposCambio.find(t => t._id === form.tipoCambio)?.nombre;
      const nombreFuncionario = funcionarios.find(f => f._id === form.entregadoPor)?.nombre;

      const dataToSend = {
        ...form,
        dia: form.dia.toString(),
        mes: form.mes.toString(),
        anio: form.anio.toString(),
        tipoEntregaNombre: nombreEntrega || form.tipoEntregaNombre,
        tipoCambioNombre: nombreCambio || form.tipoCambioNombre,
        entregadoPorNombre: nombreFuncionario || form.entregadoPorNombre
      };

      const actaGuardada = await onSave(dataToSend);

      try {
        await sendActaTarjetaEmail({
          actaId: actaGuardada?._id,
          correo: dataToSend.correo,
          nombre: dataToSend.nombre
        });
      } catch (emailError) {
        console.warn("⚠ No se pudo enviar el correo:", emailError);
      }

      onClose();
    } catch (error) {
      console.error("Error al procesar acta:", error);
      alert("❌ Ocurrió un error al procesar el acta");
    } finally {
      setLoading(false);
    }
  };

  const nombreInstitucion =
    form.sede === "foscal"
      ? "FOSCAL"
      : form.sede === "foscal-internacional"
      ? "FUNDACIÓN FOSUNAB"
      : "LA INSTITUCIÓN";

  return (
    <div className="modal-backdrop">
      <form className="modal-card" onSubmit={handleSubmit}>
        <header className="modal-header">
          <h2>
            {editingRecord
              ? "Editar Acta de Entrega"
              : "Acta de Entrega – Tarjeta Control de Acceso"}
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="modal-body">
          <div className="permissions-section">
            <div className="permission-title">Datos del Registro</div>

            <div className="form-grid">
              <label>
                Sede
                <select name="sede" value={form.sede} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  <option value="foscal">Foscal</option>
                  <option value="foscal-internacional">Foscal Internacional</option>
                </select>
              </label>

              <label>
                Tipo Entrega
                <select name="tipoEntrega" value={form.tipoEntrega} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  {tiposEntrega.map(item => (
                    <option key={item._id} value={item._id}>{item.nombre}</option>
                  ))}
                </select>
              </label>

              <label>
                Tipo Cambio
                <select name="tipoCambio" value={form.tipoCambio} onChange={handleChange} required>
                  <option value="">Seleccionar</option>
                  {tiposCambio.map(item => (
                    <option key={item._id} value={item._id}>{item.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid" style={{ marginTop: "16px" }}>
              <label>
                Número de Tarjeta
                <input 
                  name="numeroTarjeta" 
                  value={form.numeroTarjeta} 
                  onChange={handleChange} 
                  placeholder=""
                  required 
                />
              </label>

              <label>
                Entregado Por
                <select name="entregadoPor" value={form.entregadoPor} onChange={handleChange} required>
                  <option value="">Seleccionar Funcionario</option>
                  {funcionarios.map(f => (
                    <option key={f._id} value={f._id}>{f.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid" style={{ marginTop: "16px" }}>
              <label>Día <input name="dia" value={form.dia} onChange={handleChange} required /></label>
              <label>Mes <input name="mes" value={form.mes} onChange={handleChange} required /></label>
              <label>Año <input name="anio" value={form.anio} onChange={handleChange} required /></label>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Normas de Uso y Aceptación</div>
            <div className="normas-texto-completo">
              <p>Al firmar este documento se da constancia de que se recibió una tarjeta de control de acceso y se aceptan las siguientes normas de uso:</p>
              <ul>
                <li>La asignación de la tarjeta de control de acceso implica la obligación de custodiarla de modo que ninguna otra persona pueda hacer uso de la misma y por lo tanto el titular asume ante su empleador y/o ante terceros la responsabilidad por cualquier uso indebido que se haga a causa del descuido del manejo de la tarjeta de control de acceso.</li>
                <li>La tarjeta de control de acceso permite el ingreso a algunas áreas restringidas de <b>{nombreInstitucion}</b> de acuerdo a las funciones del cargo de la persona que recibe la misma, por lo tanto esta tarjeta es de uso personal e intransferible.</li>
                <li>En caso de pérdida o hurto de la tarjeta de control de acceso, el responsable de la misma deberá notificar de forma inmediata a la institución y se compromete a formular el respectivo denuncio para que <b>{nombreInstitucion}</b> tome medidas convenientes en forma oportuna. El responsable de la tarjeta asumirá todos los perjuicios que causen con la utilización no autorizada de la misma en caso de no realizar el reporte oportuno la Jefe interventoría de Outsourcing - Vigilancia 6191 - 6192.</li>
                <li>En caso de hurto, pérdida o daño de la tarjeta de control de acceso se deberá cancelar el valor correspondiente establecido en el momento.</li>
                <li>La tarjeta de control de acceso es de propiedad de la institución por lo que <b>{nombreInstitucion}</b> se reserva el derecho de solicitar la devolución. Es deber del usuario su cuidado y mantenerla en buen estado.</li>
                <li>La tarjeta de control de acceso debe ser entregada por el trabajador en la Subgerencia Tecnología al finalizar su contrato laboral con la institución o con terceros.</li>
              </ul>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Datos del Responsable</div>
            <div className="form-grid">
              <label>Nombre Completo <input name="nombre" value={form.nombre} onChange={handleChange} required /></label>
              <label>Cédula <input name="cedula" value={form.cedula} onChange={handleChange} required /></label>
              <label>Correo <input type="email" name="correo" value={form.correo} onChange={handleChange} required /></label>
            </div>
          </div>

          <div className="permissions-section">
            <div className="permission-title">Firma Digital</div>
            <FirmaCanvas onSave={(firma) => setForm(prev => ({ ...prev, firma }))} />
          </div>
        </section>

        <footer className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Procesando..." : editingRecord ? "Actualizar Acta" : "Guardar y Enviar Acta"}
          </button>
        </footer>
      </form>
    </div>
  );
}