import React, { useState, useEffect } from "react";
import "./MemoriaRamPage.css";
import MemoriaRamDialog from "./MemoriaRamDialog.jsx";


const API_URL = "http://localhost:3001/api/memorias-ram";

export default function MemoriaRamPage() {
  const [memorias, setMemorias] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadMemorias = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error cargando memorias RAM");
      const data = await res.json();
      setMemorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMemorias([]);
    }
  };

  useEffect(() => {
    loadMemorias();
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
    try {
      let payload = { ...record };

      if (!record._id) {
        payload.fecha_creacion = new Date().toISOString();
        payload.usuario_creacion = "admin";

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error creando memoria RAM");
      } else {
        const res = await fetch(`${API_URL}/${record._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error actualizando memoria RAM");
      }

      loadMemorias();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error guardando el registro");
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Memorias RAM</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Memoria RAM
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({memorias.length})
        </div>

        <div className="mui-card-body">
          {memorias.length === 0 ? (
            <div className="muted">Aún no hay memorias RAM creadas.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fecha creación</th>
                  <th>Usuario creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {memorias.map((m) => (
                  <tr key={m._id}>
                    <td>{m._id?.slice(-6)}</td>
                    <td>{m.nombre}</td>
                    <td>
                      {m.fecha_creacion
                        ? new Date(m.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{m.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(m)}
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
        <MemoriaRamDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
