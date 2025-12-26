import axios from "axios";

let sessionExpiredHandler = null;

export const setSessionExpiredHandler = (fn) => {
  sessionExpiredHandler = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* REQUEST */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* RESPONSE */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (sessionExpiredHandler) {
        sessionExpiredHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
