import React, { useState } from "react";
import "./MantenimientoForm.css";
import MantenimientoDialog from "./MantenimientoDialog";

export default function MantenimientosPage() {
  const [records, setRecords] = useState([]);
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
      setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
    } else {
      record.id = Date.now();
      setRecords((prev) => [record, ...prev]);
    }
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mui-container">
      <h1 className="mui-title">Mantenimientos</h1>
      <div
        className="mui-card"
        style={{ padding: "16px", marginBottom: "20px" }}
      >
        <button className="mui-btn mui-btn-primary" onClick={openCreateDialog}>
          + Crear Mantenimiento
        </button>
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros Guardados ({records.length})
        </div>
        <div className="mui-card-body">
          {records.length === 0 ? (
            <div className="muted">Aún no hay mantenimientos creados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
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
                    <th>Vencimiento Garantía</th>
                    <th>Min. Parada</th>
                    <th>Disponibilidad</th>
                    <th>Funcionario Realiza</th>
                    <th>Funcionario Aprueba</th>
                    <th>Orden SAP</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                

                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td>{String(r.id).slice(-6)}</td>
                      <td>{r.area}</td>
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
                        <button
                          className="small btn neutral"
                          onClick={() => openEditDialog(r)}
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
        <MantenimientoDialog
          onClose={() => setDialogOpen(false)}
          onSave={saveRecord}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
