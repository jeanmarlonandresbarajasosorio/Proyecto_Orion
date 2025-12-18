import React, { useEffect, useState } from "react";
import "./MantenimientoForm.css";
import MantenimientoDialog from "./MantenimientoDialog";

const API_URL = "http://localhost:3001/api/mantenimientos";
const PAGE_SIZE = 10;

export default function MantenimientosPage() {
  const [records, setRecords] = useState([]);
  const [visibleRecords, setVisibleRecords] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [equiposDialogOpen, setEquiposDialogOpen] = useState(false);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [filtroInventario, setFiltroInventario] = useState("");

  /* ================= BLOQUEO SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow =
      dialogOpen || equiposDialogOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [dialogOpen, equiposDialogOpen]);

  /* ================= DATA ================= */
  const loadRecords = async () => {
    try {
      setLoadingInitial(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      setTimeout(() => {
        setRecords(data);
        setVisibleRecords(data.slice(0, PAGE_SIZE));
        setLoadingInitial(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  /* ================= FILTRO ================= */
  useEffect(() => {
    setLoadingTable(true);
    const t = setTimeout(() => {
      const base = filtroInventario
        ? records.filter(r =>
            r.equipos?.some(eq =>
              eq.inventario
                ?.toLowerCase()
                .includes(filtroInventario.toLowerCase())
            )
          )
        : records;

      setVisibleRecords(base.slice(0, PAGE_SIZE));
      setLoadingTable(false);
    }, 300);

    return () => clearTimeout(t);
  }, [filtroInventario, records]);

  /* ================= HELPERS ================= */
  const f = v => (v ? v : "-");
  const d = v => (v ? new Date(v).toLocaleString() : "-");

  /* ================= UI ================= */
  return (
    <div className="mui-container">
      <h1 className="mui-title">Mantenimientos</h1>

      <div className="mui-card" style={{ padding: 16 }}>
        <button
          className="mui-btn mui-btn-primary"
          onClick={() => {
            setEditingRecord(null);
            setDialogOpen(true);
          }}
        >
          + Crear Mantenimiento
        </button>
      </div>

      <div className="mui-card" style={{ padding: 16 }}>
        <input
          className="mui-input"
          placeholder="Buscar por número de inventario..."
          value={filtroInventario}
          onChange={e => setFiltroInventario(e.target.value)}
        />
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          Registros ({visibleRecords.length})
        </div>

        <div className="mui-card-body table-container">
          {(loadingInitial || loadingTable) ? (
            <div className="orion-table-loader">
              <div className="orion-spinner" />
              <span>Cargando registros...</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Acciones</th>

                    <th>Sede</th>
                    <th>Área</th>
                    <th>Ubicación</th>
                    <th>Datos del Equipo</th>

                    <th>Fecha y Hora Retiro</th>
                    <th>Funcionario que Autoriza</th>
                    <th>Fecha y Hora Entrega</th>
                    <th>Funcionario que Recibe</th>

                    <th>Funcionario Realiza</th>
                    <th>Fecha Realiza</th>
                    <th>Funcionario Aprueba</th>
                    <th>Fecha Aprueba</th>

                    <th>Antivirus</th>
                    <th>Nombre del computador</th>
                    <th>Actualizaciones de Windows</th>
                    <th>Dominio Foscal.loc</th>
                    <th>OCS Inventory</th>
                    <th>SAP</th>

                    <th>¿Equipo en garantía?</th>
                    <th>Fecha Vencimiento</th>

                    <th>Minutos Parada</th>
                    <th>Proporción (%)</th>
                    <th>Total Minutos Disponibles</th>

                    <th>No. Orden SAP</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map(r => (
                    <tr key={r._id}>
                      <td>
                        <button
                          className="small btn neutral"
                          onClick={() => {
                            setEditingRecord(r);
                            setDialogOpen(true);
                          }}
                        >
                          Editar
                        </button>
                      </td>

                      <td>{f(r.sede)}</td>
                      <td>{f(r.area)}</td>
                      <td>{f(r.ubicacion)}</td>

                      <td>
                        <button
                          className="orion-eye-btn"
                          onClick={() => {
                            setEquiposSeleccionados(r.equipos || []);
                            setEquiposDialogOpen(true);
                          }}
                        />
                      </td>

                      <td>{d(r.fechaRetiro)}</td>
                      <td>{f(r.autorizaRetiro)}</td>
                      <td>{d(r.fechaEntrega)}</td>
                      <td>{f(r.recibe)}</td>

                      <td>{f(r.funcionarioRealiza)}</td>
                      <td>{d(r.fechaRealiza)}</td>
                      <td>{f(r.funcionarioAprueba)}</td>
                      <td>{d(r.fechaAprueba)}</td>

                      <td>{f(r.antivirus)}</td>
                      <td>{f(r.nombreComputador)}</td>
                      <td>{f(r.actualizacionesWindows)}</td>
                      <td>{f(r.dominioFoscal)}</td>
                      <td>{f(r.ocsInventory)}</td>
                      <td>{f(r.sap)}</td>

                      <td>{f(r.garantia)}</td>
                      <td>{d(r.vencimientoGarantia)}</td>

                      <td>{f(r.minutosParada)}</td>
                      <td>{f(r.proporcionParada)}</td>
                      <td>{f(r.totalMinutosDisponibles)}</td>

                      <td>{f(r.noOrdenSAP)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= DIALOG CREAR / EDITAR ================= */}
      {dialogOpen && (
        <MantenimientoDialog
          onClose={() => setDialogOpen(false)}
          onSave={loadRecords}
          editingRecord={editingRecord}
        />
      )}

      {/* ================= DIALOG DETALLE EQUIPOS (NO TOCADO) ================= */}
      {equiposDialogOpen && (
        <div className="md-overlay">
          <div className="md-modal" style={{ maxWidth: 800 }}>
            <div className="md-modal-content">
              <h2>Datos del Equipo</h2>

              {equiposSeleccionados.map((eq, i) => (
                <div key={i} className="mui-card mb">
                  <div className="mui-card-header">
                    Equipo #{i + 1}
                  </div>

                  <div className="mui-card-body grid-2">
                    <div><b>Nombre del Equipo:</b> {f(eq.nombreEquipo)}</div>
                    <div><b>Dispositivo:</b> {f(eq.dispositivo)}</div>
                    <div><b>No. Inventario:</b> {f(eq.inventario)}</div>
                    <div><b>Procesador:</b> {f(eq.procesador)}</div>
                    <div><b>Disco:</b> {f(eq.disco)}</div>
                    <div><b>RAM:</b> {f(eq.ram)}</div>
                    <div><b>Sistema Operativo:</b> {f(eq.sistemaOperativo)}</div>
                  </div>
                </div>
              ))}

              <div className="mui-actions">
                <button
                  className="mui-btn mui-btn-secondary"
                  onClick={() => setEquiposDialogOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
