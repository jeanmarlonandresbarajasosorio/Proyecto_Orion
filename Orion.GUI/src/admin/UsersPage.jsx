import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus
} from "../services/users.service";

import "./UsersPage.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ========================= */
  /* LOAD USERS */
  /* ========================= */
  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers();

      //  DEFENSIVO: soporta [] o { data: [] }
      const usersData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setUsers(usersData);
    } catch (err) {
      console.error("Error cargando usuarios", err);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ========================= */
  /* OPEN MODAL */
  /* ========================= */
  const openNew = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  /* ========================= */
  /* SAVE USER */
  /* ========================= */
  const saveUser = async (data) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, data);
      } else {
        await createUser(data);
      }

      setModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error("Error guardando usuario", err);
    }
  };

  /* ========================= */
  /* TOGGLE STATUS */
  /* ========================= */
  const toggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      loadUsers();
    } catch (err) {
      console.error("Error cambiando estado", err);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Administración de Usuarios</h2>
        <button className="btn-primary" onClick={openNew}>
          + Nuevo usuario
        </button>
      </div>

      <div className="users-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${user.active ? "on" : "off"}`}
                      onClick={() => toggleUser(user._id)}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-link"
                      onClick={() => openEdit(user)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        open={modalOpen}
        user={editingUser}
        onClose={() => setModalOpen(false)}
        onSave={saveUser}
      />
    </div>
  );
}