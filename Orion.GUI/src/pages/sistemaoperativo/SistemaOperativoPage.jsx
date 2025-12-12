import React, { useState } from "react";
import "./SistemaOperativoPage.css";
import SistemaOperativoDialog from "./SistemaOperativoDialog.jsx";

export default function SistemaOperativoPage() {
  const [sistemas, setSistemas] = useState([]);
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
      setSistemas((prev) =>
        prev.map((s) => (s.id === record.id ? record : s))
      );
    } else {
      record.id = Date.now();
      record.estado = true;
      record.fecha_creacion = new Date().toISOString();
      record.usuario_creacion = "admin";

      setSistemas((prev) => [record, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Sistema Operativo</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
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
            <div className="muted">Aún no hay sistemas operativos creados.</div>
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
                  {sistemas.map((s) => (
                    <tr key={s.id}>
                      <td>{String(s.id).slice(-6)}</td>
                      <td>{s.nombre}</td>
                      <td>{s.estado ? "Activo" : "Inactivo"}</td>
                      <td>{new Date(s.fecha_creacion).toLocaleDateString()}</td>
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
        <SistemaOperativoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
