import React, { useState } from "react";
import "./SedePage.css";
import SedeDialog from "./SedeDialog";

export default function SedePage() {
  const [sedes, setSedes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const openCreateDialog = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const saveRecord = (record) => {
    if (record.id) {
      // Editar
      setSedes((prev) => prev.map((s) => (s.id === record.id ? record : s)));
    } else {
      // Crear
      record.id = Date.now(); // ID temporal como tu ejemplo
      record.fecha_creacion = new Date().toISOString();
      record.usuario_creacion = "admin";
      record.fecha_modificacion = null;
      record.usuario_modifica = null;

      setSedes((prev) => [record, ...prev]);
    }
  };

  return (
    <div className="mui-container">

      <h1 className="mui-title">Sedes</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Sede
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({sedes.length})
        </div>

        <div className="mui-card-body">
          {sedes.length === 0 ? (
            <div className="muted">Aún no hay sedes creadas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {sedes.map((s) => (
                    <tr key={s.id}>
                      <td>{String(s.id).slice(-6)}</td>
                      <td>{s.nombre}</td>
                      <td>{s.estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        {s.fecha_creacion
                          ? new Date(s.fecha_creacion).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{s.usuario_creacion}</td>

                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(s)}
                        >
                          Editar
                        </button>

                        <button
                          className="small btn primary"
                          onClick={() => alert(JSON.stringify(s, null, 2))}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>

      {dialogOpen && (
        <SedeDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
