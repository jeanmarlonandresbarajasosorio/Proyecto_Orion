import React, { useState, useEffect } from "react";
import "./SedePage.css";
import SedeDialog from "./SedeDialog";

const API_URL = `${import.meta.env.VITE_API_URL}/sedes`;

export default function SedePage() {
  const [sedes, setSedes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadSedes = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSedes(data);
  };

  useEffect(() => {
    loadSedes();
  }, []);

  const openCreateDialog = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const saveRecord = async (record) => {
    if (record._id) {
      await fetch(`${API_URL}/${record._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    }

    setDialogOpen(false);
    setEditingRecord(null);
    loadSedes();
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
                    <tr key={s._id}>
                      <td>{s._id.slice(-6)}</td>
                      <td>{s.nombre}</td>
                      <td>{s.estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        {new Date(s.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td>{s.usuario_creacion}</td>
                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(s)}
                        >
                          Editar
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
