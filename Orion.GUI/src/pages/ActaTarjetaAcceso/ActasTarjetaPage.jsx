import React, { useEffect, useState } from "react";
import "./ActasTarjetaPage.css"; 
import ActaTarjetaDialog from "./ActaTarjetaDialog";

const API_URL = `${import.meta.env.VITE_API_URL}/actas-tarjeta`;
const PAGE_SIZE = 10;

export default function ActasTarjetaPage() {
  /* ================= DATA ================= */
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [visibleRecords, setVisibleRecords] = useState([]);

  /* ================= UI ================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  /* ================= FILTERS ================= */
  const [filtroNombre, setFiltroNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= LOADERS ================= */
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  /* ================= SCROLL LOCK ================= */
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
      // Siguiendo la lógica de ordenamiento descendente (más recientes primero)
      const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setRecords(sortedData);
      setFilteredRecords(sortedData);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error al cargar actas:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    setLoadingTable(true);
    const t = setTimeout(() => {
      let result = [...records];

      if (filtroNombre) {
        result = result.filter(r =>
          r.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()) ||
          r.cedula?.includes(filtroNombre)
        );
      }

      if (fechaInicio) {
        const fi = new Date(fechaInicio);
        result = result.filter(r => r.createdAt && new Date(r.createdAt) >= fi);
      }

      if (fechaFin) {
        const ff = new Date(fechaFin);
        ff.setHours(23, 59, 59);
        result = result.filter(r => r.createdAt && new Date(r.createdAt) <= ff);
      }

      setFilteredRecords(result);
      setCurrentPage(1);
      setLoadingTable(false);
    }, 300);
    return () => clearTimeout(t);
  }, [filtroNombre, fechaInicio, fechaFin, records]);

  /* ================= PAGINATION ================= */
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setVisibleRecords(filteredRecords.slice(start, end));
  }, [currentPage, filteredRecords]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);

  const handleSave = async (form) => {
    try {
      const method = editingRecord ? "PUT" : "POST";
      const url = editingRecord ? `${API_URL}/${editingRecord._id}` : API_URL;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDialogOpen(false);
      setEditingRecord(null);
      loadRecords();
    } catch (err) {
      console.error("Error al guardar acta:", err);
    }
  };

  const f = v => (v ? v : "-");
  const d = v => (v ? new Date(v).toLocaleDateString() : "-");

  return (
    <div className="mui-container">
      <h1 className="mui-title">Actas de Tarjeta de Acceso</h1>

      {/* ================= BARRA DE HERRAMIENTAS (Clones Mantenimiento) ================= */}
      <div className="acta-toolbar">
        <input
          className="acta-search-input"
          placeholder="Buscar por nombre o cédula..."
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
        />

        <input
          type="date"
          className="acta-date-input"
          title="Fecha Inicio"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />

        <input
          type="date"
          className="acta-date-input"
          title="Fecha Fin"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
        />

        <button
          className="btn-crear-acta"
          onClick={() => {
            setEditingRecord(null);
            setDialogOpen(true);
          }}
        >
          + Crear Acta
        </button>
      </div>

      {/* ================= TABLA (Estructura 100% idéntica) ================= */}
      <div className="mui-card">
        <div className="mui-card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', fontWeight: 700 }}>
          Registros Encontrados: {filteredRecords.length}
        </div>

        <div className="mui-card-body table-container">
          {(loadingInitial || loadingTable) ? (
            <div className="orion-table-loader">
              <div className="orion-spinner" />
              <span>Cargando registros...</span>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Funcionario</th>
                      <th>Cédula</th>
                      <th>Sede</th>
                      <th>Correo</th>
                      <th>Tipo Entrega</th>
                      <th>Tipo Cambio</th>
                      <th>Fecha Registro</th>
                      <th>ID Acta</th>
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
                        <td style={{ fontWeight: 600 }}>{f(r.nombre)}</td>
                        <td>{f(r.cedula)}</td>
                        <td>{f(r.sede)}</td>
                        <td>{f(r.correo)}</td>
                        <td>{f(r.tipoEntrega)}</td>
                        <td>{f(r.tipoCambio)}</td>
                        <td>{d(r.createdAt)}</td>
                        <td style={{ fontSize: '0.85em', color: '#666', fontFamily: 'monospace' }}>
                          {r._id.slice(-6).toUpperCase()}
                        </td>
                      </tr>
                    ))}
                    {visibleRecords.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                          No se encontraron registros de actas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación idéntica */}
              <div className="orion-pagination">
                <button
                  className="orion-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`orion-page-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="orion-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DIALOGS */}
      {dialogOpen && (
        <ActaTarjetaDialog
          onClose={() => {
            setDialogOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSave}
          editingRecord={editingRecord}
        />
      )}
    </div>
  );
}