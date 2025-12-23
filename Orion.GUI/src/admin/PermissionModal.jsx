import "./UserModal.css"; 

export default function PermissionModal({ open, onClose, permission, onSave }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      email: form.email.value.trim(),
      allowed: form.allowed.checked,
    };

    if (!data.email) return;

    onSave(data);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h2>{permission ? "Editar permiso" : "Nuevo permiso"}</h2>

        <label>
          Email
          <input
            type="email"
            name="email"
            defaultValue={permission?.email}
            required
            disabled={!!permission}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="allowed"
            defaultChecked={permission?.allowed ?? true}
          />
          Acceso permitido
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
