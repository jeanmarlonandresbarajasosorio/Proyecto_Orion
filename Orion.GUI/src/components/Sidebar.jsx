import React from "react";

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <h2>Panel</h2>
          <button className="close-x" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <nav className="menu">
          <a className="menu-item" href="#">Dashboard</a>
          <a className="menu-item" href="#">Garantías</a>
          <a className="menu-item" href="#">Chequeos</a>
          <a className="menu-item" href="#">Mantenimientos</a>
          <a className="menu-item" href="#">Hardware</a>
          <a className="menu-item" href="#">Ajustes</a>
        </nav>

        <footer className="sidebar-foot">Orion © {new Date().getFullYear()}</footer>
      </div>
    </aside>
  );
}
