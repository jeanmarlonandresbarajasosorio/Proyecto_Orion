import { useState, useEffect } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import "./styles.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className={`app-root ${sidebarOpen ? "" : "sidebar-closed"}`}>
      
      {/* TOPBAR */}
      <header className="topbar">
        <div className="left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>
          <div className="brand">Panel Orion</div>
        </div>

        <div className="right">
          <div className="user-box">Jean Marlon</div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <button className="close-arrow" onClick={() => setSidebarOpen(false)}>
          ‹
        </button>

        <h2 className="sidebar-title">Menú</h2>

        <nav className="menu">
          <a href="#">Dashboard</a>
          <a href="#">Garantías</a>
          <a href="#">Checklist Software</a>
          <a href="#">Checklist Hardware</a>
          <a href="#">Mantenimientos</a>
          <a href="#">Informacion</a>
        </nav>
      </aside>

      {/* Overlay (solo móviles) */}
      <div
        className={`overlay ${sidebarOpen && window.innerWidth <= 1100 ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="main-area">
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
      </main>
    </div>
  );
}
