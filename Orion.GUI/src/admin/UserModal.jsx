import "./UserModal.css";

export default function UserModal({ open, onClose, user, onSave }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      role: form.role.value,
      active: form.active.checked
    };

    if (!data.name || !data.email) return;

    onSave(data);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h2>{user ? "Editar usuario" : "Nuevo usuario"}</h2>

        <label>
          Nombre
          <input name="name" defaultValue={user?.name} required />
        </label>

        <label>
          Email
          <input type="email" name="email" defaultValue={user?.email} required />
        </label>

        <label>
          Rol
          <select name="role" defaultValue={user?.role || "LECTOR"}>
            <option value="ADMIN">ADMIN</option>
            <option value="TECNICO">TECNICO</option>
            <option value="LECTOR">LECTOR</option>
          </select>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="active"
            defaultChecked={user?.active ?? true}
          />
          Usuario activo
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
