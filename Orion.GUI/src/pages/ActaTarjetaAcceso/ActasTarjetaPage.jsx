import React, { useEffect, useState } from "react";
import "./ActasTarjetaPage.css";
import ActaTarjetaDialog from "./ActaTarjetaDialog";

const API_URL = `${import.meta.env.VITE_API_URL}/actas-tarjeta`;
const PAGE_SIZE = 10;

export default function ActasTarjetaPage() {
  const [records, setRecords] = useState([]);
  const [visibleRecords, setVisibleRecords] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [filtro, setFiltro] = useState("");

  /* ================= BLOQUEO SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = dialogOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [dialogOpen]);

  /* ================= LOAD DATA ================= */
  const loadRecords = async () => {
    try {
      setLoadingInitial(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      // Ordenar por fecha de creación descendente
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTimeout(() => {
        setRecords(data);
        setVisibleRecords(data.slice(0, PAGE_SIZE));
        setLoadingInitial(false);
      }, 300);
    } catch (err) {
      console.error("Error cargando registros:", err);
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async (form) => {
    try {
      const method = editingRecord ? "PUT" : "POST";
      const url = editingRecord
        ? `${API_URL}/${editingRecord._id}`
        : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setDialogOpen(false);
      setEditingRecord(null);
      loadRecords();
    } catch (err) {
      console.error("Error guardando registro:", err);
    }
  };

  /* ================= FILTRO ================= */
  useEffect(() => {
    setLoadingTable(true);
    const t = setTimeout(() => {
      const base = filtro
        ? records.filter(r =>
            r.nombre?.toLowerCase().includes(filtro.toLowerCase())
          )
        : records;

      setVisibleRecords(base.slice(0, PAGE_SIZE));
      setLoadingTable(false);
    }, 300);

    return () => clearTimeout(t);
  }, [filtro, records]);

  /* ================= FUNCIONES AUX ================= */
  const f = (v) => (v ? v : "-");

  const formatFecha = (r) => {
    if (r.dia && r.mes && r.anio) {
      return `${r.dia}/${r.mes}/${r.anio}`;
    }
    return "-";
  };

  /* ================= UI ================= */
  return (
    <div className="mui-container">
      <h1 className="mui-title">Acta Tarjeta Control de Acceso</h1>

      {/* ================= BUSCADOR + BOTÓN ================= */}
      <div className="mui-card" style={{ padding: 20, marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <input
            className="mui-input"
            placeholder="Buscar por funcionario"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            className="mui-btn mui-btn-primary"
            style={{ whiteSpace: "nowrap", height: 40 }}
            onClick={() => {
              setEditingRecord(null);
              setDialogOpen(true);
            }}
          >
            + Crear Acta
          </button>
        </div>
      </div>

      {/* ================= TABLA ================= */}
      <div className="mui-card" style={{ marginTop: 24 }}>
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
                    <th>Funcionario</th>
                    <th>Cargo</th>
                    <th>Área / Sede</th>
                    <th>Tarjeta</th>
                    <th>Fecha Entrega</th>
                    <th>Fecha Devolución</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((r) => (
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
                      <td>{f(r.nombre)}</td>
                      <td>{f(r.cargo)}</td>
                      <td>{f(r.sede)}</td>
                      <td>{f(r.numeroTarjeta)}</td>
                      <td>{formatFecha(r)}</td>
                      <td>{f(r.fechaDevolucion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= DIALOG ================= */}
      {dialogOpen && (
        <ActaTarjetaDialog
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}
