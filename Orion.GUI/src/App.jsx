import React, { useState, useEffect } from "react";
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
import ActaTarjetaPage from "./pages/ActaTarjetaAcceso/ActasTarjetaPage.jsx";
import TipoEntregaPage from "./pages/tipoentrega/TipoEntregaPage.jsx";
import TipoCambioPage from "./pages/tipocambio/TipoCambioPage.jsx";

/* ADMIN */
import UsersPage from "./admin/UsersPage.jsx";

/* ICONOS */
import { FiBell, FiLogOut, FiUser, FiLock } from "react-icons/fi";

const API_MANTENIMIENTOS = `${import.meta.env.VITE_API_URL}/mantenimientos`;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [maestrosOpen, setMaestrosOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(0);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [searchText, setSearchText] = useState("");

  const hasPermission = (p) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
    return user.permissions.includes(p);
  };

  const descargarExcel = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }
    try {
      setDescargando(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const url = `${baseUrl}/mantenimientos?format=excel&desde=${fechaDesde}&hasta=${fechaHasta}`;
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Error en el servidor");
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
      console.error(error);
      alert("Error al descargar");
    } finally {
      setDescargando(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("orion_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        if (parsedUser.role === "LECTOR" || !parsedUser.permissions?.includes("dashboard.view")) {
          setActivePage("empty");
        }
      } catch (e) {
        localStorage.removeItem("orion_user");
      }
    }
  }, []);

  useEffect(() => {
    const cargar = async () => {
      if (!isAuthenticated || !hasPermission("mantenimientos.view")) return;
      try {
        const res = await fetch(API_MANTENIMIENTOS);
        const data = await res.json();
        setNotificaciones(Array.isArray(data) ? data.length : 0);
      } catch { setNotificaciones(0); }
    };
    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleLogin = (u) => {
    setLoading(true);
    localStorage.setItem("orion_user", JSON.stringify(u));
    setUser(u);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
      if (u.role === "LECTOR" || !u.permissions?.includes("dashboard.view")) {
        setActivePage("empty");
      }
    }, 1500);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setActivePage("dashboard");
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const update = () => setSidebarOpen(window.innerWidth > 1100);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!isAuthenticated && !loading) return <Login onLogin={handleLogin} />;
  if (loading) return <WelcomeSpinner />;

  const Dashboard = () => {
    if (!hasPermission("dashboard.view")) return <AccessDenied />;
    const dataGarantias = [{ name: "Ene", value: 10 }, { name: "Feb", value: 40 }, { name: "Mar", value: 25 }, { name: "Abr", value: 60 }];
    const dataMantenimientos = [{ name: "Pendientes", value: 12 }, { name: "Completados", value: 30 }];
    const dataHardware = [{ name: "CPU", value: 30 }, { name: "RAM", value: 20 }, { name: "Discos", value: 25 }, { name: "Periféricos", value: 15 }];
    const COLORS = ["#2563EB", "#1E3A8A", "#3B82F6", "#60A5FA"];

    return (
      <>
        <section className="grid">
          <div className="card"><h3>Garantías</h3><LineChart width={320} height={200} data={dataGarantias}><Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} /><CartesianGrid stroke="#e5e7eb" /><XAxis dataKey="name" /><YAxis /><Tooltip /></LineChart></div>
          <div className="card"><h3>Mantenimientos</h3><BarChart width={320} height={200} data={dataMantenimientos}><CartesianGrid stroke="#e5e7eb" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value">{dataMantenimientos.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Bar></BarChart></div>
          <div className="card"><h3>Checklist Hardware</h3><PieChart width={320} height={240}><Pie data={dataHardware} dataKey="value" outerRadius={80} label>{dataHardware.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Legend /><Tooltip /></PieChart></div>
        </section>
        <section className="card excel-card">
          <h3>Descargar Mantenimientos</h3>
          <div className="excel-filtros">
            <div><label>Desde</label><input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} /></div>
            <div><label>Hasta</label><input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} /></div>
            <button className="excel-btn" onClick={descargarExcel} disabled={descargando}>{descargando ? "Generando..." : "Descargar Excel"}</button>
          </div>
        </section>
      </>
    );
  };

  const AccessDenied = () => (
    <div className="empty-state-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div className="card" style={{ textAlign: 'center', padding: '50px', maxWidth: '500px', borderTop: '4px solid #ef4444' }}>
        <FiLock size={60} color="#ef4444" style={{ marginBottom: '20px' }} />
        <h2>Acceso Restringido</h2>
        <p>Hola <strong>{user?.name}</strong>. Tu perfil actual (<strong>{user?.role}</strong>) no tiene permisos asignados para ver este módulo.</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>Contacta al administrador para solicitar acceso a las funciones del sistema.</p>
      </div>
    </div>
  );

  const navigate = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 1100) setSidebarOpen(false);
  };

  return (
    <div className={`app-root ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <header className="topbar">
        <div className="left">
          <button className="menu-btn" onClick={() => setSidebarOpen(s => !s)}>☰</button>
          <div className="brand">ORION</div>
        </div>
        <div className="right topbar-actions">
          {hasPermission("mantenimientos.view") && (
            <button className="notification-btn" onClick={() => navigate("listamantenimientos")}>
              <FiBell size={22} />
              {notificaciones > 0 && <span className="notification-badge">{notificaciones > 99 ? "99+" : notificaciones}</span>}
            </button>
          )}
          <div className="user-panel" onClick={() => setUserMenuOpen(o => !o)}>
            <div className="user-avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Usuario"}</span>
              <span className="user-role">{user?.role || "Lector"}</span>
            </div>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown-modern">
              <div className="dropdown-header"><FiUser /><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div>
              <button className="logout-btn" onClick={logout}><FiLogOut /> Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <button className="close-arrow" onClick={() => setSidebarOpen(false)}>‹</button>

        <div className="sidebar-logo-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 5px',
          marginBottom: '10px'
        }}>
          {/* CAMBIO: Logo consumido desde imagen física */}
          <img 
            src="/LogoOrion.png" 
            alt="Logo FOSCAL" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          />
          <span style={{
            marginTop: '10px',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '900',
            letterSpacing: '2px',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'uppercase'
          }}></span>
        </div>

        <nav className="menu">
          {hasPermission("dashboard.view") && (
            <a className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>Inicio</a>
          )}
          {hasPermission("tarjetas.view") && (
            <a className={activePage === "tarjetas-acceso" ? "active" : ""} onClick={() => setActivePage("tarjetas-acceso")}>Tarjetas de Acceso</a>
          )}
          {hasPermission("mantenimientos.view") && (
            <a className={activePage === "listamantenimientos" ? "active" : ""} onClick={() => setActivePage("listamantenimientos")}>Mantenimientos</a>
          )}
          {hasPermission("maestros.view") && (
            <div className="submenu">
              <a onClick={() => setMaestrosOpen(!maestrosOpen)}>Maestros {maestrosOpen ? "▲" : "▼"}</a>
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
                  <a onClick={() => setActivePage("tipoentrega")}>Tipo Entrega</a>
                  <a onClick={() => setActivePage("tipocambio")}>Tipo Cambio</a>
                </div>
              )}
            </div>
          )}
          {hasPermission("usuarios.view") && (
            <div className="submenu">
              <a onClick={() => setAdminOpen(!adminOpen)}>Administración {adminOpen ? "▲" : "▼"}</a>
              {adminOpen && (
                <div className="submenu-items">
                  <a onClick={() => setActivePage("admin-users")}>Usuarios</a>
                </div>
              )}
            </div>
          )}
        </nav>
      </aside>

      <main className="main-area">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "empty" && <AccessDenied />}
        {activePage === "listamantenimientos" && hasPermission("mantenimientos.view") && <MantenimientoList search={searchText} />}
        {activePage === "tarjetas-acceso" && hasPermission("tarjetas.view") && <ActaTarjetaPage />}
        {hasPermission("maestros.view") && (
          <>
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
            {activePage === "tipoentrega" && <TipoEntregaPage />}
            {activePage === "tipocambio" && <TipoCambioPage />}
          </>
        )}
        {hasPermission("usuarios.view") && (
          <>{activePage === "admin-users" && <UsersPage />}</>
        )}
      </main>
    </div>
  );
}

function WelcomeSpinner() {
  return (
    <div className="orion-loader-overlay">
      <div className="loader-particles"></div>
      <div className="orion-loader-content">
        <div className="loader-logo-wrapper">
          <div className="loader-ring orion-blue-ring"></div>
          <div className="loader-ring-outer orion-orange-ring"></div>
          
          <img 
            src="/LogoOrion.png" 
            alt="Logo FOSCAL" 
            className="loader-svg-animated"
            style={{ width: '100px', height: '100px', objectFit: 'contain', position: 'relative', zIndex: 10 }}
          />
        </div>

        <h1 className="orion-loader-title">
          BIENVENIDOS.... <span></span>
        </h1>
        
        <div className="loader-status">
          <div className="bar-container">
            <div className="progress-bar-fill orion-gradient-bar"></div>
          </div>
          <p className="orion-loader-text-animated">Sincronizando Sistema...</p>
        </div>
        <div className="foscal-tag-animated">FOSCAL</div>
      </div>
    </div>
  );
}