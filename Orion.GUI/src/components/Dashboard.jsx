import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const dataOverview = [
  { name: "Ene", Garantias: 30, Software: 50, Mantenimientos: 20, Hardware: 40 },
  { name: "Feb", Garantias: 45, Software: 60, Mantenimientos: 18, Hardware: 37 },
  { name: "Mar", Garantias: 50, Software: 62, Mantenimientos: 25, Hardware: 45 },
  { name: "Abr", Garantias: 60, Software: 70, Mantenimientos: 22, Hardware: 50 },
  { name: "May", Garantias: 55, Software: 68, Mantenimientos: 30, Hardware: 48 }
];

const pieData = [
  { name: "Listas", value: 45 },
  { name: "Pendientes", value: 25 },
  { name: "En revisión", value: 30 }
];

const COLORS = ["#2748B3", "#5B74D6", "#1E3A8A"];

export default function Dashboard({ onNotify }) {
  return (
    <div className="dashboard">
      <section className="summary-grid">
        <div className="summary-card small">
          <h4>Garantías listas</h4>
          <div className="num">45</div>
        </div>

        <div className="summary-card small">
          <h4>Chequeo de software</h4>
          <div className="num">62</div>
        </div>

        <div className="summary-card small">
          <h4>Mantenimientos pendientes</h4>
          <div className="num">18</div>
        </div>

        <div className="summary-card small">
          <h4>Chequeo hardware</h4>
          <div className="num">37</div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <h3>Garantías (últimos meses)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataOverview} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Garantias" fill="#2748B3" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Chequeo de Software</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataOverview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Software" stroke="#2748B3" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Mantenimientos pendientes (por mes)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataOverview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Mantenimientos" fill="#5B74D6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Estado general (porcentaje)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} paddingAngle={4}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="small-actions">
        <button className="btn" onClick={() => onNotify("Acción: refrescar datos")}>Refrescar</button>
      </div>
    </div>
  );
}
