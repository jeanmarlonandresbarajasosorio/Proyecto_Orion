import React, { useEffect, useState } from "react";
import "./MantenimientoForm.css";
import MantenimientoDialog from "./MantenimientoDialog";

const API_URL = `${import.meta.env.VITE_API_URL}/mantenimientos`; 

const PAGE_SIZE = 10;

export default function MantenimientosPage() {
  const [records, setRecords] = useState([]);
  const [visibleRecords, setVisibleRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]); // Para manejar el total filtrado

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [equiposDialogOpen, setEquiposDialogOpen] = useState(false);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  
  // Estados para Filtros
  const [filtroInventario, setFiltroInventario] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Estado para Paginación
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= BLOQUEO SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow =
      dialogOpen || equiposDialogOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [dialogOpen, equiposDialogOpen]);

  /* ================= LOAD DATA ================= */
  const loadRecords = async () => {
    try {
      setLoadingInitial(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      setTimeout(() => {
        setRecords(data);
        setFilteredRecords(data);
        setVisibleRecords(data.slice(0, PAGE_SIZE));
        setLoadingInitial(false);
      }, 400);
    } catch (err) {
      console.error(err);
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  /* ================= LÓGICA DE FILTRO Y PAGINACIÓN ================= */
  useEffect(() => {
    setLoadingTable(true);
    const t = setTimeout(() => {
      // 1. Filtrar
      const base = records.filter(r => {
        const coincideInventario = filtroInventario
          ? r.equipos?.some(eq => eq.inventario?.toLowerCase().includes(filtroInventario.toLowerCase()))
          : true;

        const coincideFecha = filtroFecha
          ? r.createdAt?.split("T")[0] === filtroFecha // Ajusta 'createdAt' al nombre de tu campo de fecha
          : true;

        return coincideInventario && coincideFecha;
      });

      setFilteredRecords(base);
      
      // 2. Paginar los resultados filtrados
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      setVisibleRecords(base.slice(startIndex, startIndex + PAGE_SIZE));
      
      setLoadingTable(false);
    }, 300);

    return () => clearTimeout(t);
  }, [filtroInventario, filtroFecha, records, currentPage]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroInventario, filtroFecha]);

  /* ================= SAVE ================= */
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
      console.error(err);
    }
  };

  /* ================= HELPERS ================= */
  const f = v => (v ? v : "-");
  const d = v => (v ? new Date(v).toLocaleString() : "-");
  
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);

  /* ================= UI ================= */
  return (
    <div className="mui-container">
      <h1 className="mui-title">Mantenimientos</h1>

      {/* ================= BARRA DE FILTROS ================= */}
      <div className="mui-card" style={{ padding: 20, marginTop: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
          
          {/* Filtro Inventario */}
          <input
            className="mui-input"
            placeholder="Buscar por inventario"
            value={filtroInventario}
            onChange={e => setFiltroInventario(e.target.value)}
            style={{ flex: 2, minWidth: "200px" }}
          />

          {/* Filtro Fecha */}
          <input
            type="date"
            className="mui-input"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={{ flex: 1, minWidth: "150px" }}
          />

          {/* Botón Crear */}
          <button
            className="mui-btn mui-btn-primary"
            style={{ whiteSpace: "nowrap", height: 40 }}
            onClick={() => {
              setEditingRecord(null);
              setDialogOpen(true);
            }}
          >
            + Crear Mantenimiento
          </button>
        </div>
      </div>

      {/* ================= TABLA ================= */}
      <div className="mui-card" style={{ marginTop: 24 }}>
        <div className="mui-card-header">
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
                      <th>Sede</th>
                      <th>Área</th>
                      <th>Ubicación</th>
                      <th>Equipo</th>
                      <th>Fecha Retiro</th>
                      <th>Autoriza</th>
                      {/* ... el resto de tus cabeceras ... */}
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
                        {/* ... el resto de tus celdas ... */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================= CONTROLES PAGINACIÓN ================= */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 0" }}>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="mui-btn mui-btn-secondary"
                  >
                    Anterior
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`mui-btn ${currentPage === i + 1 ? 'mui-btn-primary' : 'mui-btn-secondary'}`}
                      style={{ minWidth: "40px" }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="mui-btn mui-btn-secondary"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ... Los Modales se mantienen igual ... */}
      {dialogOpen && (
        <MantenimientoDialog
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          editingRecord={editingRecord}
        />
      )}
      
      {/* ... Modal Equipos ... */}
      {equiposDialogOpen && (
        <div className="md-overlay">
          <div className="md-modal" style={{ maxWidth: 800 }}>
             {/* Contenido del modal equipos igual que antes */}
             <div className="md-modal-content">
               <h2>Datos del Equipo</h2>
               {equiposSeleccionados.map((eq, i) => (
                 <div key={i} className="mui-card mb">
                    <div className="mui-card-body">
                      <b>Inventario:</b> {f(eq.inventario)} | <b>Equipo:</b> {f(eq.nombreEquipo)}
                    </div>
                 </div>
               ))}
               <button className="mui-btn mui-btn-secondary" onClick={() => setEquiposDialogOpen(false)}>Cerrar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}