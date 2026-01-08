import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/email-config`;

export const getEmailConfigs = () => axios.get(API_URL);

export const createEmailConfig = (data) =>
  axios.post(API_URL, data);

export const updateEmailConfig = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const toggleEmailConfig = (id) =>
  axios.patch(`${API_URL}/${id}/toggle`);
