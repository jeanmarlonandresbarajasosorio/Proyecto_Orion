import { useEffect, useState } from "react";
import PermissionModal from "./PermissionModal";
import {
  getPermissions,
  createPermission,
  updatePermission,
  togglePermissionStatus,
  deletePermission,
} from "../services/permissions.service";

import "./UsersPage.css"; 

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ========================= */
  /* LOAD PERMISSIONS */
  /* ========================= */
  const loadPermissions = async () => {
    try {
      setLoading(true);
      const res = await getPermissions();
      setPermissions(res.data || []);
    } catch (err) {
      console.error("Error cargando permisos", err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  /* ========================= */
  /* OPEN MODAL */
  /* ========================= */
  const openNew = () => {
    setEditingPermission(null);
    setModalOpen(true);
  };

  const openEdit = (permission) => {
    setEditingPermission(permission);
    setModalOpen(true);
  };

  /* ========================= */
  /* SAVE */
  /* ========================= */
  const savePermission = async (data) => {
    try {
      if (editingPermission) {
        await updatePermission(editingPermission._id, data);
      } else {
        await createPermission(data);
      }
      setModalOpen(false);
      setEditingPermission(null);
      loadPermissions();
    } catch (err) {
      console.error("Error guardando permiso", err);
    }
  };

  /* ========================= */
  /* TOGGLE */
  /* ========================= */
  const togglePermission = async (id) => {
    try {
      await togglePermissionStatus(id);
      loadPermissions();
    } catch (err) {
      console.error("Error cambiando permiso", err);
    }
  };

  /* ========================= */
  /* DELETE */
  /* ========================= */
  const removePermission = async (id) => {
    if (!confirm("¿Eliminar este permiso?")) return;
    await deletePermission(id);
    loadPermissions();
  };

  if (loading) return <p>Cargando permisos...</p>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Permisos de Acceso</h2>
        <button className="btn-primary" onClick={openNew}>
          + Nuevo permiso
        </button>
      </div>

      <div className="users-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {permissions.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No hay permisos registrados
                </td>
              </tr>
            ) : (
              permissions.map((p) => (
                <tr key={p._id}>
                  <td>{p.email}</td>
                  <td>
                    <span
                      className={`status ${p.allowed ? "on" : "off"}`}
                      onClick={() => togglePermission(p._id)}
                    >
                      {p.allowed ? "Permitido" : "Bloqueado"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-link" onClick={() => openEdit(p)}>
                      Editar
                    </button>
                    {" | "}
                    <button
                      className="btn-link"
                      onClick={() => removePermission(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PermissionModal
        open={modalOpen}
        permission={editingPermission}
        onClose={() => setModalOpen(false)}
        onSave={savePermission}
      />
    </div>
  );
}
