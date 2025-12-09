import { useState } from "react";
import MantenimientoDialog from "../components/MantenimientoDialog";
import "./mantenimientoPage.css";

export default function MantenimientoPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const [mantenimientos, setMantenimientos] = useState([]);

  const handleGuardar = (nuevo) => {
    setMantenimientos([...mantenimientos, nuevo]);
    setOpenDialog(false);
  };

  return (
    <div className="orion-container">

      {/* ENCABEZADO */}
      <div className="orion-header">
        <h2>Mantenimientos</h2>

        <button
          className="orion-add-btn"
          onClick={() => setOpenDialog(true)}
        >
          + Nuevo
        </button>
      </div>

      {/* TARJETA DE TABLA */}
      <div className="orion-card">
        <h3 className="card-title">Lista de Mantenimientos Registrados</h3>

        <div className="table-wrapper">
          <table className="orion-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Estatus</th>
                <th>Técnico</th>
                <th>Tiempo</th>
                <th>Repuestos</th>
                <th>Estado Final</th>
              </tr>
            </thead>

            <tbody>
              {mantenimientos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    No hay mantenimientos registrados.
                  </td>
                </tr>
              ) : (
                mantenimientos.map((m, i) => (
                  <tr key={i}>
                    <td>{m.tipo}</td>
                    <td>{m.estatus}</td>
                    <td>{m.tecnico}</td>
                    <td>{m.tiempo} h</td>
                    <td>{m.repuestos}</td>
                    <td>{m.estadoFinal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <MantenimientoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleGuardar}
      />
    </div>
  );
}
