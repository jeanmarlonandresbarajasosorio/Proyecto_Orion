import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <h2 style={{ padding: 20 }}>⛔ Acceso denegado</h2>;
  }

  return children;
}
