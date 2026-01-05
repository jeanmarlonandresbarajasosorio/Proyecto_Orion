import api from "./api";

/**
 * Función auxiliar para obtener el token del localStorage
 * y configurar el header de autorización.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); 
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/* ========================= */
/* GET ALL USERS */
/* ========================= */
export const getUsers = async () => {
  // Pasamos los headers como segundo argumento en GET
  const res = await api.get("/users", getAuthHeaders());
  return res;
};

/* ========================= */
/* CREATE USER */
/* ========================= */
export const createUser = async (data) => {
  // Pasamos los headers como tercer argumento en POST (después del body)
  const res = await api.post("/users", data, getAuthHeaders());
  return res;
};

/* ========================= */
/* UPDATE USER */
/* ========================= */
export const updateUser = async (id, data) => {
  // Pasamos los headers como tercer argumento en PUT
  const res = await api.put(`/users/${id}`, data, getAuthHeaders());
  return res;
};

/* ========================= */
/* TOGGLE USER STATUS */
/* ========================= */
export const toggleUserStatus = async (id) => {
  // Pasamos los headers como segundo argumento en PATCH
  const res = await api.patch(`/users/${id}/toggle`, {}, getAuthHeaders());
  return res;
};