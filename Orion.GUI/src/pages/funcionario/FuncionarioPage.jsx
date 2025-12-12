import React, { useState } from "react";
import "./FuncionarioPage.css";
import FuncionarioDialog from "./FuncionarioDialog.jsx";

export default function FuncionarioPage() {
  const [funcionarios, setFuncionarios] = useState([]);
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
      setFuncionarios((prev) =>
        prev.map((f) => (f.id === record.id ? record : f))
      );
    } else {
      record.id = Date.now();
      record.estado = true;
      record.fecha_creacion = new Date().toISOString();
      record.usuario_creacion = "admin";

      setFuncionarios((prev) => [record, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Funcionarios</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
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
                  {funcionarios.map((f) => (
                    <tr key={f.id}>
                      <td>{String(f.id).slice(-6)}</td>
                      <td>{f.nombre}</td>
                      <td>{f.estado ? "Activo" : "Inactivo"}</td>
                      <td>{new Date(f.fecha_creacion).toLocaleDateString()}</td>
                      <td>{f.usuario_creacion}</td>

                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(f)}
                        >
                          Editar
                        </button>

                        <button
                          className="small btn primary"
                          onClick={() => alert(JSON.stringify(f, null, 2))}
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
        <FuncionarioDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
