import { useAuth } from "../context/AuthContext";

export default function usePermissions() {
  const { user } = useAuth();

  const role = user?.role;
  const permissions = user?.permissions || [];

  const can = (permission) => {
    if (!permission) return false;
    if (role === "ADMIN") return true;
    return permissions.includes(permission);
  };

  return { can };
}
