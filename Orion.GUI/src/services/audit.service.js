import api from "./api"; // tu axios configurado

export const getLastAuditByEntity = (entity, id) => {
  return api.get(`/audit/entity/${entity}/${id}`);
};
