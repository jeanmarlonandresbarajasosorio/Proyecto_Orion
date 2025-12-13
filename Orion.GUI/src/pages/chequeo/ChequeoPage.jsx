import React, { useState, useEffect } from "react";
import "./ChequeoPage.css";
import ChequeoDialog from "./ChequeoDialog.jsx";

const API_URL = "http://localhost:3001/api/listas-chequeo";

export default function ChequeoPage() {
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
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
      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const created = await res.json();
      setItems((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Checklist de Chequeo</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Chequeo
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({items.length})
        </div>

        <div className="mui-card-body">
          {items.length === 0 ? (
            <div className="muted">Aún no hay registros creados.</div>
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
                {items.map((item, index) => (
                  <tr key={item._id ?? index}>
                    <td>{item._id ? item._id.slice(-6) : "-"}</td>
                    <td>{item.nombre || "-"}</td>
                    <td>{item.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      {item.fecha_creacion
                        ? new Date(item.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{item.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(item)}
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
        <ChequeoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
