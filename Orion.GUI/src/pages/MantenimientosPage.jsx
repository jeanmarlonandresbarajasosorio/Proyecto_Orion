import React, { useEffect, useState } from "react";
import "./MantenimientoForm.css";
import MantenimientoDialog from "./MantenimientoDialog";

const API_URL = "http://localhost:3001/api/mantenimientos";
export default function MantenimientosPage() {
  const [records, setRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Error cargando mantenimientos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
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
      const isEdit = Boolean(record._id);

      const res = await fetch(
        isEdit ? `${API_URL}/${record._id}` : API_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        }
      );

      if (!res.ok) throw new Error("Error guardando mantenimiento");

      await loadRecords();
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error guardando mantenimiento");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("¿Eliminar mantenimiento?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      await loadRecords();
    } catch (err) {
      console.error(err);
      alert("Error eliminando mantenimiento");
    }
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Mantenimientos</h1>

      <div className="mui-card" style={{ padding: "16px", marginBottom: "20px" }}>
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Mantenimiento
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({records.length})
        </div>

        <div className="mui-card-body">
          {loading ? (
            <div className="muted">Cargando...</div>
          ) : records.length === 0 ? (
            <div className="muted">Aún no hay mantenimientos creados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Acciones</th>
                    <th>ID</th>
                    <th>Sede</th>
                    <th>Área</th>
                    <th>Ubicación</th>
                    <th>Dispositivo</th>
                    <th>Inventario</th>
                    <th>Equipo</th>
                    <th>Disco</th>
                    <th>RAM</th>
                    <th>Procesador</th>
                    <th>SO</th>
                    <th>Fecha Retiro</th>
                    <th>Fecha Entrega</th>
                    <th>Garantía</th>
                    <th>Vencimiento</th>
                    <th>Min. Parada</th>
                    <th>Disponibilidad</th>
                    <th>Realiza</th>
                    <th>Aprueba</th>
                    <th>Orden SAP</th>
                  </tr>
                </thead>

                <tbody> 
                  
                  {records.map((r) => (
                    
                    <tr key={r._id}>
                            <td>
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(r)}
                        >
                          Editar
                        </button>
                      </td>
                      <td>{r._id.slice(-6)}</td>
                      <td>{r.sede}</td>
                      <td>{r.area}</td>
                      <td>{r.ubicacion}</td>
                      <td>{r.dispositivo}</td>
                      <td>{r.inventario}</td>
                      <td>{r.nombreEquipo}</td>
                      <td>{r.disco}</td>
                      <td>{r.ram}</td>
                      <td>{r.procesador}</td>
                      <td>{r.so}</td>
                      <td>
                        {r.fechaRetiro
                          ? new Date(r.fechaRetiro).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {r.fechaEntrega
                          ? new Date(r.fechaEntrega).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{r.garantia}</td>
                      <td>{r.vencimientoGarantia}</td>
                      <td>{r.minutosParada}</td>
                      <td>{r.totalDisponibilidad}</td>
                      <td>{r.funcionarioRealiza}</td>
                      <td>{r.funcionarioAprueba}</td>
                      <td>{r.noOrdenSAP}</td>
                      <td>
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
        <MantenimientoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
