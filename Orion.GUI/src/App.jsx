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
import AreaPage from "./pages/area/areapage.jsx";
import FuncionarioPage from "./pages/funcionario/FuncionarioPage.jsx";
import ChequeoPage from "./pages/chequeo/ChequeoPage.jsx";
import TipoListaPage from "./pages/tipolista/TipoListaPage.jsx";
import TipoDispositivoPage from "./pages/tipodispositivo/TipoDispositivoPage.jsx";
import SistemaOperativoPage from "./pages/sistemaoperativo/SistemaOperativoPage.jsx";
import DiscoDuroPage from "./pages/discoduro/DiscoDuroPage.jsx";
import MemoriaRamPage from "./pages/memoriaram/MemoriaRamPage.jsx";
import ProcesadorPage from "./pages/procesador/ProcesadorPage.jsx";

/* ICONOS */
import { FiBell, FiLogOut, FiUser, FiX } from "react-icons/fi";

const API_MANTENIMIENTOS = "http://localhost:3001/api/mantenimientos";

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
  const [notificaciones, setNotificaciones] = useState(0);

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
  /* NOTIFICACIONES 🔔     */
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

      {/* 🔍 FILTRO */}
      <div className="filtro-container-grande">
        <h3>Buscar Mantenimientos</h3>
        <input
          type="text"
          className="filtro-input-grande"
          placeholder="Buscar por nombre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="filtro-btn-grande"
          onClick={() => setActivePage("listamantenimientos")}
        >
          Buscar
        </button>
      </div>
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

          {/* 🔔 NOTIFICACIONES */}
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

          {/* 👤 USER */}
          <div className="user-panel" onClick={() => setUserMenuOpen(o => !o)}>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">consulta</span>
            </div>
          </div>

          {userMenuOpen && (
            <div className="user-dropdown-modern">
              <div className="dropdown-header">
                <FiUser />
                <div>
                  <strong>{user?.name}</strong>
                  <small>Rol: consulta</small>
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
      </main>
    </div>
  );
}

/* ===================== */
/*  LOADER ORION       */
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
