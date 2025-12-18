import React, { useState, useEffect } from "react";
import "./ProcesadorPage.css";
import ProcesadorDialog from "./ProcesadorDialog.jsx";

const API_URL = "http://localhost:3001/api/procesadores";

export default function ProcesadorPage() {
  const [procesadores, setProcesadores] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadProcesadores = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error cargando procesadores");
      const data = await res.json();
      setProcesadores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProcesadores([]);
    }
  };

  useEffect(() => {
    loadProcesadores();
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

        if (!res.ok) throw new Error("Error creando procesador");
      } else {
        const res = await fetch(`${API_URL}/${record._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error actualizando procesador");
      }

      loadProcesadores();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error guardando el registro");
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Procesadores</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Procesador
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({procesadores.length})
        </div>

        <div className="mui-card-body">
          {procesadores.length === 0 ? (
            <div className="muted">Aún no hay procesadores creados.</div>
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
                {procesadores.map((p) => (
                  <tr key={p._id}>
                    <td>{p._id?.slice(-6)}</td>
                    <td>{p.nombre}</td>
                    <td>
                      {p.fecha_creacion
                        ? new Date(p.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{p.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(p)}
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
        <ProcesadorDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
