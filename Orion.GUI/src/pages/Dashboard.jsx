import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenido, {user.name}</h1>
      <p>Rol: <b>{user.role}</b></p>

      <nav style={{ marginTop: 20 }}>
        {user.permissions.includes("roles.manage") && (
          <Link to="/admin">Panel Administrador</Link>
        )}
      </nav>

      <button onClick={logout} style={{ marginTop: 20 }}>
        Cerrar sesión
      </button>
    </div>
  );
}
