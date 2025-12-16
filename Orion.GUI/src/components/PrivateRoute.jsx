export default function PrivateRoute({ isAuthenticated, children }) {

  // ❌ No autenticado → no renderiza la app
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Autenticado → renderiza todo
  return <>{children}</>;
}
