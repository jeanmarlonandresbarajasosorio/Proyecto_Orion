import React from "react";

export default function Topbar({ onToggleSidebar, darkMode, setDarkMode, onNotify }) {
  return (
    <header className="topbar">
      <div className="top-left">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="menu">
          <span />
          <span />
          <span />
        </button>
        <h1 className="brand">Orion</h1>
      </div>

      <div className="top-right">
        <button className="btn ghost" onClick={onNotify}>Notificar</button>

        <div className="toggle-row">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="slider" />
          </label>
          <span className="small-txt">Modo oscuro</span>
        </div>
      </div>
    </header>
  );
}
