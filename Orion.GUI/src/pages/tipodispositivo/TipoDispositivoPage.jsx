import React, { useState } from "react";
import "./TipoDispositivoPage.css";
import TipoDispositivoDialog from "./TipoDispositivoDialog.jsx";

export default function TipoDispositivoPage() {
  const [tipos, setTipos] = useState([]);
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
      // Editar
      setTipos((prev) => prev.map((t) => (t.id === record.id ? record : t)));
    } else {
      // Crear
      record.id = Date.now();
      record.estado = true;
      record.fecha_creacion = new Date().toISOString();
      record.usuario_creacion = "admin";

      setTipos((prev) => [record, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Tipo Dispositivo</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Tipo de Dispositivo
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({tipos.length})
        </div>

        <div className="mui-card-body">
          {tipos.length === 0 ? (
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
                  {tipos.map((t) => (
                    <tr key={t.id}>
                      <td>{String(t.id).slice(-6)}</td>
                      <td>{t.nombre}</td>
                      <td>{t.estado ? "Activo" : "Inactivo"}</td>
                      <td>{new Date(t.fecha_creacion).toLocaleDateString()}</td>
                      <td>{t.usuario_creacion}</td>

                      <td>
                        <button className="small btn neutral" onClick={() => openEditDialog(t)}>
                          Editar
                        </button>

                        <button
                          className="small btn primary"
                          onClick={() => alert(JSON.stringify(t, null, 2))}
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
        <TipoDispositivoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
