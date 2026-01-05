import React, { useState, useEffect } from "react";
import "./UserModal.css";

/* ===============================
   PERMISOS DISPONIBLES EN EL SISTEMA
================================ */
const PERMISSIONS_MASTER = [
  {
    module: "Dashboard",
    permissions: [
      { key: "dashboard.view", label: "Ver Estadísticas y Gráficas" }
    ]
  },
  {
    module: "Mantenimientos",
    permissions: [
      { key: "mantenimientos.view", label: "Ver Listado" },
      { key: "mantenimientos.create", label: "Crear Nuevo" },
      { key: "mantenimientos.edit", label: "Editar" },
      { key: "mantenimientos.delete", label: "Eliminar" }
    ]
  },

  /* 🔑 NUEVO MÓDULO */
  {
    module: "Tarjetas de Acceso",
    permissions: [
      { key: "tarjetas.view", label: "Ver Actas de Tarjeta de Acceso" },
      { key: "tarjetas.create", label: "Crear Acta de Tarjeta" }
    ]
  },

  {
    module: "Maestros",
    permissions: [
      { key: "maestros.view", label: "Ver Tablas Maestras" }
    ]
  },
  {
    module: "Administración",
    permissions: [
      { key: "usuarios.view", label: "Ver Usuarios" },
      { key: "usuarios.create", label: "Crear Usuarios" },
      { key: "usuarios.edit", label: "Editar Usuarios" }
    ]
  }
];

/* ===============================
   PRESETS POR ROL
================================ */
const ROLE_PRESETS = {
  ADMIN: [
    "dashboard.view",
    "usuarios.view",
    "usuarios.create",
    "usuarios.edit",
    "mantenimientos.view",
    "mantenimientos.create",
    "mantenimientos.edit",
    "mantenimientos.delete",
    "maestros.view",
    "tarjetas.view",
    "tarjetas.create"
  ],
  TECNICO: [
    "dashboard.view",
    "mantenimientos.view",
    "mantenimientos.create",
    "mantenimientos.edit",
    "tarjetas.view",
    "tarjetas.create"
  ],
  LECTOR: []
};

/* ===============================
   COMPONENTE
================================ */
export default function UserModal({ open, onClose, user, onSave }) {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("LECTOR");

  useEffect(() => {
    if (open) {
      setRole(user?.role || "LECTOR");
      setPermissions(user?.permissions || []);
    }
  }, [user, open]);

  if (!open) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setPermissions(ROLE_PRESETS[newRole] || []);
  };

  const togglePermission = (key) => {
    setPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      role,
      active: formData.get("active") === "on",
      permissions
    };

    onSave(data);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card" onSubmit={handleSubmit}>
        <header className="modal-header">
          <h2>{user ? "Editar usuario" : "Nuevo usuario"}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <section className="modal-body">
          <div className="form-grid">
            <label>
              Nombre
              <input
                name="name"
                defaultValue={user?.name || ""}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                defaultValue={user?.email || ""}
                required
              />
            </label>

            <label>
              Rol
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                required
              >
                <option value="ADMIN">Administrador</option>
                <option value="TECNICO">Técnico</option>
                <option value="LECTOR">Lector (Sin acceso)</option>
              </select>
            </label>

            <label className="checkbox inline">
              <input
                type="checkbox"
                name="active"
                defaultChecked={user?.active ?? true}
              />
              Usuario activo
            </label>
          </div>

          <div className="permissions-section">
            <h3>Asignación de Permisos</h3>
            <p className="help-text">
              Puedes ajustar permisos manualmente si lo necesitas.
            </p>

            {PERMISSIONS_MASTER.map((group) => (
              <div key={group.module} className="permission-group">
                <div className="permission-title">{group.module}</div>
                <div className="permission-list">
                  {group.permissions.map((p) => (
                    <label key={p.key} className="permission-item">
                      <input
                        type="checkbox"
                        checked={permissions.includes(p.key)}
                        onChange={() => togglePermission(p.key)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {permissions.length === 0 && (
              <div className="permissions-warning">
                ⚠️ Este usuario no tendrá acceso a ninguna sección del sistema.
              </div>
            )}
          </div>
        </section>

        <footer className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar Usuario
          </button>
        </footer>
      </form>
    </div>
  );
}
