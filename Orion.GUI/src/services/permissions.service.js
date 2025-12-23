import api from "./api";

export const getPermissions = () => api.get("/permissions");
export const createPermission = (data) => api.post("/permissions", data);
export const updatePermission = (id, data) =>
  api.put(`/permissions/${id}`, data);
export const togglePermissionStatus = (id) =>
  api.patch(`/permissions/${id}/toggle`);
export const deletePermission = (id) =>
  api.delete(`/permissions/${id}`);
