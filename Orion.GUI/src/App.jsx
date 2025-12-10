import { useState, useEffect } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import "./styles.css";

import MantenimientoList from "./pages/MantenimientosPage.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [userName] = useState("Jean Marlon");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const logout = () => {
    alert("Sesión cerrada");
  };

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

  useEffect(() => {
    const update = () => {
      if (window.innerWidth > 1100) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const Dashboard = () => (
    <>
      <section className="grid">
        <div className="card">
          <h3>Garantías (últimos meses)</h3>
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
              {dataMantenimientos.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        <div className="card">
          <h3>Checklist Hardware</h3>
          <PieChart width={320} height={240}>
            <Pie
              data={dataHardware}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {dataHardware.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </section>

      <div className="filtro-container-grande">
        <h3>Buscar Mantenimientos Pendientes</h3>

        <input
          type="text"
          placeholder="Ingrese el nombre del diseño..."
          className="filtro-input-grande"
          onChange={(e) => console.log("Buscar:", e.target.value)}
        />

        <button className="filtro-btn-grande">
          Buscar
        </button>
      </div>
    </>
  );

  return (
    <div className={`app-root ${sidebarOpen ? "" : "sidebar-closed"}`}>

      <header className="topbar">
        <div className="left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>
          <div className="brand">ORION</div>
        </div>

        <div className="right" style={{ position: "relative" }}>
          <div
            className="user-box"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            {userName}
          </div>

          {userMenuOpen && (
            <div className="user-dropdown">
              <button onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <button className="close-arrow" onClick={() => setSidebarOpen(false)}>
          ‹
        </button>

        <h2 className="sidebar-title">Menú</h2>

        <nav className="menu">
          <a
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Garantías
          </a>

          <a
            className={activePage === "listamantenimientos" ? "active" : ""}
            onClick={() => setActivePage("listamantenimientos")}
          >
            Mantenimientos
          </a>

          <a
            className={activePage === "info" ? "active" : ""}
            onClick={() => setActivePage("info")}
          >
            Información
          </a>
        </nav>
      </aside>

      <div
        className={`overlay ${sidebarOpen && window.innerWidth <= 1100 ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "listamantenimientos" && <MantenimientoList />}
        {activePage === "info" && <h2>Información del Sistema</h2>}
      </main>
    </div>
  );
}
