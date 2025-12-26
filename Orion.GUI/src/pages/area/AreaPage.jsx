import React, { useState, useEffect } from "react";
import "./AreaPage.css";
import AreaDialog from "./AreaDialog.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/areas`;

export default function AreaPage() {
  const [areas, setAreas] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setAreas(Array.isArray(data) ? data : []))
      .catch(() => setAreas([]));
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
      const res = await fetch(`${API_URL}/${record._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const updated = await res.json();
      setAreas((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const created = await res.json();
      setAreas((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Áreas</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Área
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({areas.length})
        </div>

        <div className="mui-card-body">
          {areas.length === 0 ? (
            <div className="muted">Aún no hay áreas creadas.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {areas.map((a, index) => (
                  <tr key={a._id ?? index}>
                    <td>{a._id ? a._id.slice(-6) : "-"}</td>
                    <td>{a.nombre}</td>
                    <td>{a.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      {a.fecha_creacion
                        ? new Date(a.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{a.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(a)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {dialogOpen && (
        <AreaDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
