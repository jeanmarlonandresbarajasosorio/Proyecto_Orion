import React, { useState, useEffect } from "react";
import "./FuncionarioPage.css";
import FuncionarioDialog from "./FuncionarioDialog.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/funcionarios`;

export default function FuncionarioPage() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setFuncionarios(Array.isArray(data) ? data : []))
      .catch(() => setFuncionarios([]));
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
      setFuncionarios((prev) =>
        prev.map((f) => (f._id === updated._id ? updated : f))
      );
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const created = await res.json();
      setFuncionarios((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Funcionarios</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Funcionario
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({funcionarios.length})
        </div>

        <div className="mui-card-body">
          {funcionarios.length === 0 ? (
            <div className="muted">Aún no hay funcionarios creados.</div>
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
                {funcionarios.map((f, index) => (
                  <tr key={f._id ?? index}>
                    <td>{f._id ? f._id.slice(-6) : "-"}</td>
                    <td>{f.nombre}</td>
                    <td>{f.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      {f.fecha_creacion
                        ? new Date(f.fecha_creacion).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{f.usuario_creacion || "-"}</td>
                    <td>
                      <button
                        className="small btn neutral"
                        onClick={() => openEditDialog(f)}
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
        <FuncionarioDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
