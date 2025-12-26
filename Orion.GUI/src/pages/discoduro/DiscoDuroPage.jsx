import React, { useState, useEffect } from "react";
import "./DiscoDuroPage.css";
import DiscoDuroDialog from "./DiscoDuroDialog.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/discos-duros`;

export default function DiscoDuroPage() {
  const [discos, setDiscos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadDiscos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error cargando discos duros");
      const data = await res.json();
      setDiscos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setDiscos([]);
    }
  };

  useEffect(() => {
    loadDiscos();
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
        // CREATE
        payload.fecha_creacion = new Date().toISOString();
        payload.usuario_creacion = "admin";

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error creando disco duro");
      } else {
        const res = await fetch(`${API_URL}/${record._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error actualizando disco duro");
      }

      loadDiscos();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error guardando el registro");
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Discos Duros</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Disco Duro
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({discos.length})
        </div>

        <div className="mui-card-body">
          {discos.length === 0 ? (
            <div className="muted">Aún no hay discos duros creados.</div>
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
                {discos.map((d) => (
                  <tr key={d._id}>
                    <td>{d._id?.slice(-6)}</td>
                    <td>{d.nombre}</td>
                    <td>
                      {d.fecha_creacion
                        ? new Date(d.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{d.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(d)}
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
        <DiscoDuroDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
