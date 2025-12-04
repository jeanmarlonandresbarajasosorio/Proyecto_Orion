import React from "react";
export default function Sidebar({onLogout}){
  return (
    <aside className="sidebar">
      <h3>ORION</h3>
      <nav>
        <a className="nav-link" href="/dashboard">Dashboard</a>
        <a className="nav-link" href="/dashboard/assets">Activos</a>
        <a className="nav-link" href="/dashboard/mantenimientos">Mantenimientos</a>
        <a className="nav-link" href="/dashboard/settings">Ajustes</a>
      </nav>
      <div style={{position:"absolute", bottom:20, width:"100%"}}>
        <button onClick={onLogout}>Salir</button>
      </div>
    </aside>
  );
}
