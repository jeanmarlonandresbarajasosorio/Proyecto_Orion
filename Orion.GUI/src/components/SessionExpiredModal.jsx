import "./SessionExpiredModal.css";

export default function SessionExpiredModal({ open }) {
  if (!open) return null;

  return (
    <div className="session-backdrop">
      <div className="session-card">
        <h2>Sesión expirada</h2>
        <p>
          Tu sesión ha expirado por seguridad.
          <br />
          Por favor inicia sesión nuevamente.
        </p>

        <div className="spinner" />

        <span className="redirect-text">
          Redirigiendo al login...
        </span>
      </div>
    </div>
  );
}
