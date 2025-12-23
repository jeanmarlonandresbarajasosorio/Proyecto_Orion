import api from "./api";

/* ========================= */
/* GET ALL USERS */
/* ========================= */
export const getUsers = async () => {
  const res = await api.get("/users");
  return res;
};

/* ========================= */
/* CREATE USER */
/* ========================= */
export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res;
};

/* ========================= */
/* UPDATE USER */
/* ========================= */
export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res;
};

/* ========================= */
/* TOGGLE USER STATUS */
/* ========================= */
export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/users/${id}/toggle`);
  return res;
};
