import { useState, useEffect } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import "./styles.css";

/* LOGIN */
import Login from "./pages/Login.jsx";

/* PÁGINAS */
import MantenimientoList from "./pages/MantenimientosPage.jsx";
import SedePage from "./pages/sedes/SedePage.jsx";
import AreaPage from "./pages/area/AreaPage.jsx";
import FuncionarioPage from "./pages/funcionario/FuncionarioPage.jsx";
import ChequeoPage from "./pages/chequeo/ChequeoPage.jsx";
import TipoListaPage from "./pages/tipolista/TipoListaPage.jsx";
import TipoDispositivoPage from "./pages/tipodispositivo/TipoDispositivoPage.jsx";
import SistemaOperativoPage from "./pages/sistemaoperativo/SistemaOperativoPage.jsx";
import DiscoDuroPage from "./pages/discoduro/DiscoDuroPage.jsx";
import MemoriaRamPage from "./pages/memoriaram/MemoriaRamPage.jsx";
import ProcesadorPage from "./pages/procesador/ProcesadorPage.jsx";
/* ADMIN */
import AdminPanel from "./admin/AdminPanel.jsx";
import UsersPage from "./admin/UsersPage.jsx";
import RolesPage from "./admin/RolesPage.jsx";
import PermissionsPage from "./admin/PermissionsPage.jsx";

/* ICONOS */
import { FiBell, FiLogOut, FiUser, FiX } from "react-icons/fi";

const API_MANTENIMIENTOS = "http://localhost:5000/api/mantenimientos";

export default function App() {

  /* ===================== */
  /* AUTH + LOADER         */
  /* ===================== */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  /* ===================== */
  /* UI STATES             */
  /* ===================== */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [maestrosOpen, setMaestrosOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(0);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descargando, setDescargando] = useState(false);

  /* ===================== */
  /* DESCARGA EXCEL        */
  /* ===================== */
const descargarExcel = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }

    try {
      setDescargando(true);
      
      // Asegúrate de que esta URL coincida con tu Backend
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const url = `${baseUrl}/mantenimientos?format=excel&desde=${fechaDesde}&hasta=${fechaHasta}`;

      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("El servidor no pudo generar el archivo");
      }

      // IMPORTANTE: Manejar como BLOB
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `Reporte_ORION_${fechaDesde}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar. Verifica que el Backend esté encendido y tenga instalada la librería exceljs.");
    } finally {
      setDescargando(false);
    }
  };

  /* ===================== */
  /* FILTRO BÚSQUEDA       */
  /* ===================== */
  const [searchText, setSearchText] = useState("");

  /* ===================== */
  /* RESTAURAR SESIÓN      */
  /* ===================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("orion_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  /* ===================== */
  /* NOTIFICACIONES        */
  /* ===================== */
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(API_MANTENIMIENTOS);
        const data = await res.json();
        setNotificaciones(Array.isArray(data) ? data.length : 0);
      } catch {
        setNotificaciones(0);
      }
    };

    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ===================== */
  /* LOGIN / LOGOUT        */
  /* ===================== */
  const handleLogin = (u) => {
    setLoading(true);
    localStorage.setItem("orion_user", JSON.stringify(u));
    setUser(u);

    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
    }, 1500);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setActivePage("dashboard");
  };

  /* ===================== */
  /* RESPONSIVE SIDEBAR    */
  /* ===================== */
  useEffect(() => {
    const update = () => setSidebarOpen(window.innerWidth > 1100);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ===================== */
  /* LOGIN / LOADER VIEW   */
  /* ===================== */
  if (!isAuthenticated && !loading) return <Login onLogin={handleLogin} />;
  if (loading) return <WelcomeSpinner />;

  /* ===================== */
  /* DASHBOARD DATA        */
  /* ===================== */
  const dataGarantias = [
    { name: "Ene", value: 10 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 25 },
    { name: "Abr", value: 60 },
  ];

  const dataMantenimientos = [
    { name: "Pendientes", value: 12 },
    { name: "Completados", value: 30 },
  ];

  const dataHardware = [
    { name: "CPU", value: 30 },
    { name: "RAM", value: 20 },
    { name: "Discos", value: 25 },
    { name: "Periféricos", value: 15 },
  ];

  const COLORS = ["#2563EB", "#1E3A8A", "#3B82F6", "#60A5FA"];

  /* ===================== */
  /* DASHBOARD VIEW        */
  /* ===================== */
  const Dashboard = () => (
    <>
      {/* ====== GRÁFICAS ====== */}
      <section className="grid">
        <div className="card">
          <h3>Garantías</h3>
          <LineChart width={320} height={200} data={dataGarantias}>
            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} />
            <CartesianGrid stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        <div className="card">
          <h3>Mantenimientos</h3>
          <BarChart width={320} height={200} data={dataMantenimientos}>
            <CartesianGrid stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {dataMantenimientos.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        <div className="card">
          <h3>Checklist Hardware</h3>
          <PieChart width={320} height={240}>
            <Pie data={dataHardware} dataKey="value" outerRadius={80} label>
              {dataHardware.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </section>
      
       {/* ====== DESCARGA EXCEL ====== */}
      <section className="card excel-card">
        <h3>Descargar Mantenimientos</h3>

        <div className="excel-filtros">
          <div>
            <label>Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          <div>
            <label>Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>

          <button
            className="excel-btn"
            onClick={descargarExcel}
            disabled={descargando}
          >
            {descargando ? "Generando..." : "Descargar Excel"}
          </button>
        </div>
      </section>

    </>
  );

  const navigate = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 1100) setSidebarOpen(false);
  };

  return (
    <div className={`app-root ${sidebarOpen ? "" : "sidebar-closed"}`}>

      {/* ================= TOPBAR ================= */}
      <header className="topbar">
        <div className="left">
          <button className="menu-btn" onClick={() => setSidebarOpen(s => !s)}>☰</button>
          <div className="brand">ORION</div>
        </div>

        <div className="right topbar-actions">

          {/* NOTIFICACIONES */}
          <button
            className="notification-btn"
            onClick={() => navigate("listamantenimientos")}
          >
            <FiBell size={22} />
            {notificaciones > 0 && (
              <span className="notification-badge">
                {notificaciones > 99 ? "99+" : notificaciones}
              </span>
            )}
          </button>

          {/* USER */}
          <div className="user-panel" onClick={() => setUserMenuOpen(o => !o)}>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          {userMenuOpen && (
            <div className="user-dropdown-modern">
              <div className="dropdown-header">
                <FiUser />
                <div>
                  <strong>{user?.name}</strong>
                  <small>Rol: {user?.role}</small>
                </div>
              </div>

              <button className="logout-btn" onClick={logout}>
                <FiLogOut /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <button className="close-arrow" onClick={() => setSidebarOpen(false)}>‹</button>
        <h2 className="sidebar-title">Menú</h2>

        <nav className="menu">
          <a className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>
            Inicio
          </a>

          <a className={activePage === "listamantenimientos" ? "active" : ""} onClick={() => setActivePage("listamantenimientos")}>
            Mantenimientos
          </a>

          <div className="submenu">
            <a onClick={() => setMaestrosOpen(!maestrosOpen)}>
              Maestros {maestrosOpen ? "▲" : "▼"}
            </a>

            {maestrosOpen && (
              <div className="submenu-items">
                <a onClick={() => setActivePage("tipodispositivo")}>Tipo Dispositivo</a>
                <a onClick={() => setActivePage("sistemaoperativo")}>Sistema Operativo</a>
                <a onClick={() => setActivePage("tipolista")}>Tipo Lista</a>
                <a onClick={() => setActivePage("chequeo")}>Lista Chequeo</a>
                <a onClick={() => setActivePage("discoduro")}>Disco Duro</a> 
                <a onClick={() => setActivePage("memoriaram")}>Memoria RAM</a>
                <a onClick={() => setActivePage("procesador")}>Procesador</a>
                <a onClick={() => setActivePage("funcionarios")}>Funcionario</a>
                <a onClick={() => setActivePage("sedes")}>Sede</a>
                <a onClick={() => setActivePage("area")}>Área</a>
              </div>
            )}
            
            {/* ================= ADMIN ================= */}
            {user?.role === "ADMIN" && (
              <div className="submenu">
                <a onClick={() => setAdminOpen(!adminOpen)}>
                  Administración {adminOpen ? "▲" : "▼"}
                </a>

                {adminOpen && (
                  <div className="submenu-items">
                    <a onClick={() => setActivePage("admin-users")}>Usuarios</a>
                    <a onClick={() => setActivePage("admin-permissions")}>Permisos</a>
                  </div>
                )}
              </div>
            )}

          </div>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-area">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "listamantenimientos" && (
          <MantenimientoList search={searchText} />
        )}
        {activePage === "tipodispositivo" && <TipoDispositivoPage />}
        {activePage === "sistemaoperativo" && <SistemaOperativoPage />}
        {activePage === "tipolista" && <TipoListaPage />}
        {activePage === "discoduro" && <DiscoDuroPage />}
        {activePage === "memoriaram" && <MemoriaRamPage />}
        {activePage === "procesador" && <ProcesadorPage />}
        {activePage === "chequeo" && <ChequeoPage />}
        {activePage === "funcionarios" && <FuncionarioPage />}
        {activePage === "sedes" && <SedePage />}
        {activePage === "area" && <AreaPage />}
        {/* ================= ADMIN ================= */}
        {activePage === "admin-users" && <UsersPage />}
        {activePage === "admin-permissions" && <PermissionsPage />}
      </main>
    </div>
  );
}

/* ===================== */
/* LOADER ORION         */
/* ===================== */
function WelcomeSpinner() {
  return (
    <div className="orion-loader-overlay">
      <div className="orion-loader-content">
        <h1 className="orion-loader-title">
          Bienvenido a <span>ORION</span>
        </h1>
        <p className="orion-loader-text">Cargando sistema…</p>
        <div className="orion-spinner"></div>
      </div>
    </div>
  );
}