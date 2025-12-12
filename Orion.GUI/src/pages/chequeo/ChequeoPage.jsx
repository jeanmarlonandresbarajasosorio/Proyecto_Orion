import React, { useState } from "react";
import "./ChequeoPage.css";
import ChequeoDialog from "./ChequeoDialog.jsx";

export default function ChequeoPage() {
  const [items, setItems] = useState([]);
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
      setItems((prev) => prev.map((e) => (e.id === record.id ? record : e)));
    } else {
      record.id = Date.now();
      record.estado = true;
      record.fecha_creacion = new Date().toISOString();
      record.usuario_creacion = "admin";

      setItems((prev) => [record, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Checklist de Chequeo</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
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
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{String(item.id).slice(-6)}</td>
                      <td>{item.nombre}</td>
                      <td>{item.estado ? "Activo" : "Inactivo"}</td>
                      <td>{new Date(item.fecha_creacion).toLocaleDateString()}</td>
                      <td>{item.usuario_creacion}</td>

                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="small btn primary"
                          onClick={() => alert(JSON.stringify(item, null, 2))}
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
        <ChequeoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
