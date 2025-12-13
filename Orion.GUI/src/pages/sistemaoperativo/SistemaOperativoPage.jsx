import React, { useState, useEffect } from "react";
import "./SistemaOperativoPage.css";
import SistemaOperativoDialog from "./SistemaOperativoDialog.jsx";

const API_URL = "http://localhost:3001/api/sistemas-operativos";

export default function SistemaOperativoPage() {
  const [sistemas, setSistemas] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setSistemas(Array.isArray(data) ? data : []))
      .catch(() => setSistemas([]));
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
    const payload = { ...record };
    delete payload.id;

    if (payload._id) {
      const res = await fetch(`${API_URL}/${payload._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updated = await res.json();

      setSistemas((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const created = await res.json();

      if (!created?._id) {
        console.error("El backend devolvió el registro sin _id", created);
        return;
      }

      setSistemas((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Sistema Operativo</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Sistema Operativo
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({sistemas.length})
        </div>

        <div className="mui-card-body">
          {sistemas.length === 0 ? (
            <div className="muted">
              Aún no hay sistemas operativos creados.
            </div>
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
                {sistemas.map((s) => (
                  <tr key={s._id}>
                    <td>{s._id.slice(-6)}</td>
                    <td>{s.nombre}</td>
                    <td>{s.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      {s.fecha_creacion
                        ? new Date(s.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{s.usuario_creacion || "-"}</td>
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
          )}
        </div>
      </div>

      {dialogOpen && (
        <SistemaOperativoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
