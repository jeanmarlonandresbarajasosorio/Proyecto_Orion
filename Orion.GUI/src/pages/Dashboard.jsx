import React from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard(){
  const { logout } = useAuth();
  return (
    <>
      <Sidebar onLogout={logout} />
      <div className="content">
        <h1>Dashboard</h1>
        <p>Bienvenido al panel protegido.</p>
      </div>
    </>
  );
}
