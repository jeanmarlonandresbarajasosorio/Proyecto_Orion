import React, { useState, useEffect } from "react";
import "./TipoListaPage.css";
import TipoListaDialog from "./TipoListaDialog";

// CAMBIO AQUÍ: Usamos la variable de entorno de Vite
const API_URL = `${import.meta.env.VITE_API_URL}/tipos-lista`;

export default function TipoListaPage() {
  const [tipos, setTipos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTipos(Array.isArray(data) ? data : []))
      .catch(() => setTipos([]));
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

      setTipos((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const created = await res.json();
      setTipos((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Tipos de Lista</h1>

      <div className="mui-card" style={{ padding: 16, marginBottom: 20 }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Tipo de Lista
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({tipos.length})
        </div>

        <div className="mui-card-body">
          {tipos.length === 0 ? (
            <div className="muted">Aún no hay tipos de lista creados.</div>
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
                  {tipos.map((t, index) => (
                    <tr key={t._id ?? index}>
                      <td>{t._id ? t._id.slice(-6) : "-"}</td>
                      <td>{t.nombre}</td>
                      <td>{t.estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        {t.fecha_creacion
                          ? new Date(t.fecha_creacion).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{t.usuario_creacion || "-"}</td>
                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(t)}
                        >
                          Editar
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
        <TipoListaDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}